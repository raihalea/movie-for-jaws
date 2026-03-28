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

export type JawsUgLTProps = {
  eventTitle: string;
  chapterName: string;
  jawsugIconUrl?: string;
  chapterIconUrl?: string;
  speakers: SpeakerGroup[];
  hashtag: string;
  musicLicense?: MusicLicense;
  musicDurationInSeconds: number;
  musicUrl?: string;
  theme?: ColorTheme;
  introTheme?: Partial<ColorTheme>;
  titleTheme?: Partial<ColorTheme>;
  speakerTheme?: Partial<ColorTheme>;
  hashtagTheme?: Partial<ColorTheme>;
  licenseTheme?: Partial<ColorTheme>;
};
