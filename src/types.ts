export type Speaker = {
  name: string;
  affiliation: string;
  photoUrl: string;
};

export type SpeakerGroup = {
  talkTitle: string;
  speakers: Speaker[];
};

export type MusicLicense = {
  title: string;
  artist: string;
  url?: string;
  licenseType?: string;
};

export type ColorTheme = {
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  mutedTextColor: string;
  gradientFrom: string;
  gradientTo: string;
};

export type SceneThemeOverride = Partial<ColorTheme>;

export type IntroEffect = 'scaleIn' | 'fadeSlide' | 'typewriter' | 'elasticDrop';
export type TitleEffect = 'springScale' | 'glitch' | 'wipeIn' | 'flipReveal';
export type SpeakerEffect = 'springCards' | 'slideFromSides' | 'fadeStagger' | 'spiralIn';
export type HashtagEffect = 'springBounce' | 'rotateIn' | 'pulseGlow' | 'shakeReveal';
export type LicenseEffect = 'fadeIn' | 'slideUp' | 'typewriter' | 'zoomSpin';

export type JawsUgLTProps = {
  eventTitle: string;
  chapterName: string;
  eventDate?: string;
  jawsugIconUrl?: string;
  chapterIconUrl?: string;
  speakers: SpeakerGroup[];
  hashtag: string;
  musicLicense?: MusicLicense;
  musicDurationInSeconds?: number;
  musicUrl?: string;
  theme?: ColorTheme;
  introTheme?: Partial<ColorTheme>;
  titleTheme?: Partial<ColorTheme>;
  speakerTheme?: Partial<ColorTheme>;
  hashtagTheme?: Partial<ColorTheme>;
  licenseTheme?: Partial<ColorTheme>;
  introEffect?: IntroEffect;
  titleEffect?: TitleEffect;
  speakerEffect?: SpeakerEffect;
  hashtagEffect?: HashtagEffect;
  licenseEffect?: LicenseEffect;
};
