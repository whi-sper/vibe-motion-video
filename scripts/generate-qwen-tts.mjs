import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(ROOT_DIR, 'data', 'tts-scenes.json');
const PUBLIC_TTS_DIR = path.join(ROOT_DIR, 'public', 'tts');
const MANIFEST_PATH = path.join(PUBLIC_TTS_DIR, 'manifest.json');
const GENERATED_TS_PATH = path.join(ROOT_DIR, 'src', 'data', 'scene-audio.ts');

loadEnvFile(path.join(ROOT_DIR, '.env.local'));

const API_URL =
  process.env.QWEN_TTS_API_URL ??
  'https://dashscope.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer';

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const dryRun = args.has('--dry-run');

const apiKey = requireEnv('QWEN_TTS_API_KEY');
const defaultModel = process.env.QWEN_TTS_MODEL ?? 'cosyvoice-v3.5-plus';
const defaultVoice = requireEnv('QWEN_TTS_VOICE');

const config = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf8'));
const manifest = await readJsonSafe(MANIFEST_PATH, { items: {} });
const nextItems = {};

await fs.mkdir(PUBLIC_TTS_DIR, { recursive: true });

for (const scene of config.scenes ?? []) {
  validateScene(scene);

  const text = scene.text.trim();
  if (!text) {
    console.warn(`[skip] scene ${scene.sceneId}: empty text`);
    continue;
  }

  const outputFormat = scene.format ?? config.global?.format ?? 'wav';
  const outputFileName = scene.outputFileName ?? `narration.${outputFormat}`;
  const relPath = path.posix.join('tts', scene.sceneId, outputFileName);
  const absPath = path.join(ROOT_DIR, 'public', relPath);

  const requestModel = scene.model ?? config.global?.model ?? defaultModel;
  const requestVoice = scene.voice ?? config.global?.voice ?? defaultVoice;
  const requestInput = compactObject({
    text,
    voice: requestVoice,
    format: outputFormat,
    sample_rate: scene.sampleRate ?? config.global?.sampleRate,
    volume: scene.volume ?? config.global?.volume,
    rate: scene.rate ?? config.global?.rate,
    pitch: scene.pitch ?? config.global?.pitch,
    instruction:
      scene.instruction ||
      config.global?.instruction ||
      undefined,
    language_hints:
      scene.languageHints ?? config.global?.languageHints ?? undefined,
    enable_ssml:
      scene.enableSsml ?? config.global?.enableSsml ?? undefined,
  });

  const fingerprint = sha1(
    JSON.stringify({
      model: requestModel,
      input: requestInput,
    })
  );

  const previous = manifest.items?.[scene.sceneId];
  const fileExists = await exists(absPath);

  if (!force && fileExists && previous?.fingerprint === fingerprint) {
    nextItems[scene.sceneId] = previous;
    console.log(`[skip] scene ${scene.sceneId}: unchanged`);
    continue;
  }

  if (dryRun) {
    console.log(`[dry-run] scene ${scene.sceneId}: ${text}`);
    continue;
  }

  console.log(`[generate] scene ${scene.sceneId}`);
  await fs.mkdir(path.dirname(absPath), { recursive: true });

  const response = await synthesize({
    apiKey,
    model: requestModel,
    input: requestInput,
  });
  const audioUrl = response.output?.audio?.url;

  if (!audioUrl) {
    throw new Error(
      `scene ${scene.sceneId} returned no audio URL: ${JSON.stringify(response)}`
    );
  }

  const audioBuffer = await downloadBuffer(audioUrl);
  await fs.writeFile(absPath, audioBuffer);

  const durationSec =
    outputFormat === 'wav' ? getWavDurationSec(audioBuffer) : undefined;

  nextItems[scene.sceneId] = {
    sceneId: scene.sceneId,
    text,
    src: relPath.replaceAll(path.sep, '/'),
    format: outputFormat,
    model: requestModel,
    voice: requestVoice,
    requestId: response.request_id,
    durationSec,
    characters: response.usage?.characters,
    fingerprint,
    generatedAt: new Date().toISOString(),
  };
}

if (!dryRun) {
  const nextManifest = {
    generatedAt: new Date().toISOString(),
    items: nextItems,
  };

  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(nextManifest, null, 2)}\n`);
  await fs.writeFile(GENERATED_TS_PATH, buildSceneAudioModule(nextItems));

  const generatedCount = Object.keys(nextItems).length;
  console.log(`Generated scene audio manifest with ${generatedCount} entries.`);
}

function validateScene(scene) {
  if (!scene || typeof scene !== 'object') {
    throw new Error('Each scene entry must be an object.');
  }

  if (typeof scene.sceneId !== 'string' || !scene.sceneId.trim()) {
    throw new Error(`Invalid sceneId: ${JSON.stringify(scene)}`);
  }

  if (typeof scene.text !== 'string') {
    throw new Error(`Scene ${scene.sceneId} is missing a string text field.`);
  }
}

function buildSceneAudioModule(items) {
  const serializable = {};

  for (const [sceneId, item] of Object.entries(items)) {
    serializable[sceneId] = {
      src: item.src,
      durationSec: item.durationSec,
      requestId: item.requestId,
      model: item.model,
      voice: item.voice,
      text: item.text,
    };
  }

  return `import type { SceneId } from '../types';

export interface SceneAudioMeta {
  src: string;
  durationSec?: number;
  requestId: string;
  model: string;
  voice: string;
  text: string;
}

// Auto-generated by scripts/generate-qwen-tts.mjs
export const SCENE_AUDIO: Partial<Record<SceneId, SceneAudioMeta>> = ${JSON.stringify(
    serializable,
    null,
    2
  )};
`;
}

async function synthesize(payload) {
  const response = await fetchWithRetry(
    API_URL,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${payload.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: payload.model,
        input: payload.input,
      }),
    },
    'TTS request'
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `TTS request failed (${response.status} ${response.statusText}): ${errorText}`
    );
  }

  return response.json();
}

async function downloadBuffer(url) {
  const response = await fetchWithRetry(url, {}, 'Audio download');
  if (!response.ok) {
    throw new Error(
      `Audio download failed (${response.status} ${response.statusText})`
    );
  }

  return Buffer.from(await response.arrayBuffer());
}

async function fetchWithRetry(url, options, label) {
  const attempts = 3;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(90000),
      });
    } catch (error) {
      if (attempt === attempts) {
        const detail =
          error instanceof Error ? error.message : JSON.stringify(error);
        throw new Error(`${label} failed after ${attempts} attempts: ${detail}`);
      }

      console.warn(`[retry] ${label} attempt ${attempt}/${attempts} failed`);
      await wait(attempt * 1500);
    }
  }

  throw new Error(`${label} failed unexpectedly.`);
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getWavDurationSec(buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF') {
    return undefined;
  }

  let offset = 12;
  let sampleRate;
  let byteRate;
  let dataSize;

  while (offset + 8 <= buffer.length) {
    const chunkId = buffer.toString('ascii', offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const chunkDataOffset = offset + 8;

    if (chunkId === 'fmt ') {
      sampleRate = buffer.readUInt32LE(chunkDataOffset + 4);
      byteRate = buffer.readUInt32LE(chunkDataOffset + 8);
    }

    if (chunkId === 'data') {
      dataSize = chunkSize;
      break;
    }

    offset = chunkDataOffset + chunkSize + (chunkSize % 2);
  }

  if (!dataSize) {
    return undefined;
  }

  if (byteRate && byteRate > 0) {
    return round(dataSize / byteRate);
  }

  if (sampleRate && sampleRate > 0) {
    return round(dataSize / sampleRate);
  }

  return undefined;
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

function compactObject(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined && value !== '')
  );
}

function sha1(value) {
  return createHash('sha1').update(value).digest('hex');
}

function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

function loadEnvFile(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      const equalIndex = trimmed.indexOf('=');
      if (equalIndex === -1) {
        continue;
      }
      const key = trimmed.slice(0, equalIndex).trim();
      const value = trimmed.slice(equalIndex + 1).trim();
      if (key && process.env[key] == null) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return;
    }
    throw error;
  }
}

async function readJsonSafe(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return fallback;
    }
    throw error;
  }
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
