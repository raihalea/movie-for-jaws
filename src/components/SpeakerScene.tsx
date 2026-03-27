import React from "react";
import {
  AbsoluteFill,
  Img,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import type { SpeakerGroup, Speaker } from "../types";

const { fontFamily } = loadFont();

interface SpeakerSceneProps {
  speakerGroup: SpeakerGroup;
  index: number;
}

const getSpeakerImgSrc = (photoUrl: string): string => {
  if (photoUrl.startsWith("http")) {
    return photoUrl;
  }
  return staticFile(photoUrl);
};

const SpeakerCard: React.FC<{
  speaker: Speaker;
  frame: number;
  fps: number;
  delay: number;
  photoSize: number;
  nameSize: number;
  affiliationSize: number;
}> = ({ speaker, frame, fps, delay, photoSize, nameSize, affiliationSize }) => {
  const photoScale = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });
  const nameScale = spring({
    fps,
    frame: Math.max(0, frame - delay - 8),
    config: { damping: 14, stiffness: 80, mass: 0.6 },
  });
  const affiliationOpacity = Math.min(
    1,
    Math.max(0, (frame - delay - 15) / 10),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: photoSize,
          height: photoSize,
          borderRadius: "50%",
          overflow: "hidden",
          border: "4px solid #FF9900",
          transform: `scale(${photoScale})`,
        }}
      >
        <Img
          src={getSpeakerImgSrc(speaker.photoUrl)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
      <div
        style={{
          color: "#ffffff",
          fontSize: nameSize,
          fontWeight: 700,
          textAlign: "center",
          transform: `scale(${nameScale})`,
        }}
      >
        {speaker.name}
      </div>
      <div
        style={{
          color: "#a0a0b0",
          fontSize: affiliationSize,
          textAlign: "center",
          opacity: affiliationOpacity,
        }}
      >
        {speaker.affiliation}
      </div>
    </div>
  );
};

const OneSpeakerLayout: React.FC<{
  speakerGroup: SpeakerGroup;
  frame: number;
  fps: number;
}> = ({ speakerGroup, frame, fps }) => {
  const titleOpacity = Math.min(1, Math.max(0, (frame - 30) / 15));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 40,
      }}
    >
      <SpeakerCard
        speaker={speakerGroup.speakers[0]}
        frame={frame}
        fps={fps}
        delay={5}
        photoSize={280}
        nameSize={52}
        affiliationSize={32}
      />
      <div
        style={{
          color: "#FF9900",
          fontSize: 40,
          fontWeight: 700,
          textAlign: "center",
          maxWidth: 1200,
          opacity: titleOpacity,
          padding: "0 80px",
        }}
      >
        {speakerGroup.talkTitle}
      </div>
    </div>
  );
};

const TwoSpeakerLayout: React.FC<{
  speakerGroup: SpeakerGroup;
  frame: number;
  fps: number;
}> = ({ speakerGroup, frame, fps }) => {
  const titleOpacity = Math.min(1, Math.max(0, (frame - 35) / 15));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 120,
        }}
      >
        {speakerGroup.speakers.map((speaker, i) => (
          <SpeakerCard
            key={i}
            speaker={speaker}
            frame={frame}
            fps={fps}
            delay={5 + i * 10}
            photoSize={220}
            nameSize={44}
            affiliationSize={28}
          />
        ))}
      </div>
      <div
        style={{
          color: "#FF9900",
          fontSize: 38,
          fontWeight: 700,
          textAlign: "center",
          maxWidth: 1400,
          opacity: titleOpacity,
          padding: "0 80px",
        }}
      >
        {speakerGroup.talkTitle}
      </div>
    </div>
  );
};

const ThreeSpeakerLayout: React.FC<{
  speakerGroup: SpeakerGroup;
  frame: number;
  fps: number;
}> = ({ speakerGroup, frame, fps }) => {
  const titleOpacity = Math.min(1, Math.max(0, (frame - 40) / 15));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 30,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 80,
        }}
      >
        {speakerGroup.speakers.map((speaker, i) => (
          <SpeakerCard
            key={i}
            speaker={speaker}
            frame={frame}
            fps={fps}
            delay={5 + i * 8}
            photoSize={180}
            nameSize={36}
            affiliationSize={24}
          />
        ))}
      </div>
      <div
        style={{
          color: "#FF9900",
          fontSize: 36,
          fontWeight: 700,
          textAlign: "center",
          maxWidth: 1500,
          opacity: titleOpacity,
          padding: "0 60px",
        }}
      >
        {speakerGroup.talkTitle}
      </div>
    </div>
  );
};

export const SpeakerScene: React.FC<SpeakerSceneProps> = ({
  speakerGroup,
  index,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const speakerCount = speakerGroup.speakers.length;

  const backgrounds = [
    "linear-gradient(180deg, #0f0f23 0%, #1a1a2e 100%)",
    "linear-gradient(180deg, #16213e 0%, #1a1a2e 100%)",
    "linear-gradient(180deg, #0f0f23 0%, #16213e 100%)",
  ];

  return (
    <AbsoluteFill
      style={{
        background: backgrounds[index % backgrounds.length],
        fontFamily,
      }}
    >
      {speakerCount === 1 && (
        <OneSpeakerLayout
          speakerGroup={speakerGroup}
          frame={frame}
          fps={fps}
        />
      )}
      {speakerCount === 2 && (
        <TwoSpeakerLayout
          speakerGroup={speakerGroup}
          frame={frame}
          fps={fps}
        />
      )}
      {speakerCount >= 3 && (
        <ThreeSpeakerLayout
          speakerGroup={speakerGroup}
          frame={frame}
          fps={fps}
        />
      )}
    </AbsoluteFill>
  );
};
