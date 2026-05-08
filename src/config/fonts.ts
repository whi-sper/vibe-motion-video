import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadInstrumentSerif } from '@remotion/google-fonts/InstrumentSerif';
import { loadFont as loadNotoSansSC } from '@remotion/google-fonts/NotoSansSC';

const { fontFamily: interFamily } = loadInter();
const { fontFamily: instrumentSerifFamily } = loadInstrumentSerif();
const { fontFamily: notoSansSCFamily } = loadNotoSansSC();

export const FONTS = {
  inter: interFamily,
  instrumentSerif: instrumentSerifFamily,
  notoSansSC: notoSansSCFamily,
  sans: `${interFamily}, ${notoSansSCFamily}, -apple-system, sans-serif`,
  serif: `${instrumentSerifFamily}, serif`,
  chinese: `${notoSansSCFamily}, sans-serif`,
  counter: `${interFamily}, ${notoSansSCFamily}, sans-serif`,
} as const;
