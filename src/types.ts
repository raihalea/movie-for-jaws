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

export type JawsUgLTProps = {
  eventTitle: string;
  chapterName: string;
  jawsugIconUrl?: string;
  chapterIconUrl?: string;
  speakers: SpeakerGroup[];
  hashtag: string;
  musicLicense: MusicLicense;
  musicDurationInSeconds: number;
  musicUrl?: string;
};
