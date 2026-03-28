import React from "react";
import { Composition, staticFile } from "remotion";
import { JawsUgLT } from "./compositions/JawsUgLT";
import type { JawsUgLTProps } from "./types";
import type { CalculateMetadataFunction } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { DEFAULT_MUSIC_DURATION_SECONDS } from "./utils/timing";

const defaultProps: JawsUgLTProps = {
  eventTitle: "JAWS-UG 東京 #50 LT大会",
  chapterName: "JAWS-UG 東京",
  speakers: [
    {
      talkTitle: "AWS Lambda の最新アップデートについて",
      speakers: [
        {
          name: "山田 太郎",
          affiliation: "株式会社クラウドテック",
          photoUrl: "speaker-placeholder.svg",
        },
      ],
    },
    {
      talkTitle: "Amazon S3 コスト最適化の実践",
      speakers: [
        {
          name: "鈴木 花子",
          affiliation: "テックスタート株式会社",
          photoUrl: "speaker-placeholder.svg",
        },
        {
          name: "佐藤 一郎",
          affiliation: "株式会社デジタルソリューション",
          photoUrl: "speaker-placeholder.svg",
        },
      ],
    },
    {
      talkTitle: "ECS on Fargate で実現するサーバーレスコンテナ",
      speakers: [
        {
          name: "田中 美咲",
          affiliation: "AWSジャパン合同会社",
          photoUrl: "speaker-placeholder.svg",
        },
        {
          name: "高橋 健太",
          affiliation: "株式会社インフラボ",
          photoUrl: "speaker-placeholder.svg",
        },
        {
          name: "渡辺 さくら",
          affiliation: "フリーランス",
          photoUrl: "speaker-placeholder.svg",
        },
      ],
    },
  ],
  hashtag: "#jawsug_tokyo",
  musicLicense: {
    title: "Sunny Days",
    artist: "Sample Artist",
    licenseType: "CC BY 4.0",
    url: "https://example.com/license",
  },
  theme: {
    backgroundColor: "#2d3561",
    accentColor: "#FF9900",
    textColor: "#ffffff",
    mutedTextColor: "#c8c8d8",
    gradientFrom: "#1e2749",
    gradientTo: "#3a4785",
  },
  introEffect: "scaleIn",
  titleEffect: "springScale",
  speakerEffect: "springCards",
  hashtagEffect: "springBounce",
  licenseEffect: "fadeIn",
};

const calculateMetadata: CalculateMetadataFunction<JawsUgLTProps> = async ({
  props,
}) => {
  let musicDuration = props.musicDurationInSeconds;

  if (musicDuration == null && props.musicUrl) {
    musicDuration = await getAudioDurationInSeconds(
      staticFile(props.musicUrl),
    );
  }

  if (musicDuration == null) {
    musicDuration = DEFAULT_MUSIC_DURATION_SECONDS;
  }

  return {
    durationInFrames: Math.round(musicDuration * 30),
    props: {
      ...props,
      musicDurationInSeconds: musicDuration,
    },
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="JawsUgLT"
      component={JawsUgLT}
      durationInFrames={90 * 30}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={defaultProps}
      calculateMetadata={calculateMetadata}
    />
  );
};
