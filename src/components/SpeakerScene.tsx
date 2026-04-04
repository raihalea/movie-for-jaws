import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "../utils/font";
import type { SpeakerGroup, Speaker, ColorTheme, SpeakerEffect } from "../types";

interface SpeakerSceneProps {
  speakerGroup: SpeakerGroup;
  index: number;
  theme: ColorTheme;
  effect?: SpeakerEffect;
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
  theme: ColorTheme;
  effect?: SpeakerEffect;
  cardIndex?: number;
}> = ({ speaker, frame, fps, delay, photoSize, nameSize, affiliationSize, theme, effect = 'springCards', cardIndex = 0 }) => {
  // springCards: original spring-based animation
  const photoScale = effect === 'springCards'
    ? spring({
        fps,
        frame: Math.max(0, frame - delay),
        config: { damping: 12, stiffness: 100, mass: 0.5 },
      })
    : 1;
  const nameScale = effect === 'springCards'
    ? spring({
        fps,
        frame: Math.max(0, frame - delay - 8),
        config: { damping: 14, stiffness: 80, mass: 0.6 },
      })
    : 1;
  const affiliationOpacity = effect === 'springCards'
    ? Math.min(1, Math.max(0, (frame - delay - 15) / 10))
    : 1;

  // slideFromSides: cards slide in from alternating sides
  const fromLeft = cardIndex % 2 === 0;
  const slideTranslateX = effect === 'slideFromSides'
    ? interpolate(frame, [delay, delay + 20], [fromLeft ? -200 : 200, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const slideOpacity = effect === 'slideFromSides'
    ? interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  // fadeStagger: staggered fade-in with upward motion
  const staggerDelay = effect === 'fadeStagger' ? cardIndex * 12 : 0;
  const fadeOpacity = effect === 'fadeStagger'
    ? interpolate(frame, [staggerDelay, staggerDelay + 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;
  const fadeTranslateY = effect === 'fadeStagger'
    ? interpolate(frame, [staggerDelay, staggerDelay + 20], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // spiralIn: cards spiral in from offscreen with rotation and scale
  const spiralStaggerDelay = delay + cardIndex * 10;
  const spiralTranslateX = effect === 'spiralIn'
    ? interpolate(frame, [spiralStaggerDelay, spiralStaggerDelay + 25], [cardIndex % 2 === 0 ? -400 : 400, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const spiralRotate = effect === 'spiralIn'
    ? interpolate(frame, [spiralStaggerDelay, spiralStaggerDelay + 25], [cardIndex % 2 === 0 ? -180 : 180, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const spiralScale = effect === 'spiralIn'
    ? interpolate(frame, [spiralStaggerDelay, spiralStaggerDelay + 25], [0.2, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;
  const spiralOpacity = effect === 'spiralIn'
    ? interpolate(frame, [spiralStaggerDelay, spiralStaggerDelay + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  // Compute wrapper styles based on effect
  const wrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  };

  if (effect === 'slideFromSides') {
    wrapperStyle.transform = `translateX(${slideTranslateX}px)`;
    wrapperStyle.opacity = slideOpacity;
  } else if (effect === 'fadeStagger') {
    wrapperStyle.transform = `translateY(${fadeTranslateY}px)`;
    wrapperStyle.opacity = fadeOpacity;
  } else if (effect === 'spiralIn') {
    wrapperStyle.transform = `translateX(${spiralTranslateX}px) rotate(${spiralRotate}deg) scale(${spiralScale})`;
    wrapperStyle.opacity = spiralOpacity;
  }

  return (
    <div style={wrapperStyle}>
      <div
        style={{
          width: photoSize,
          height: photoSize,
          borderRadius: "50%",
          overflow: "hidden",
          border: `5px solid ${theme.accentColor}`,
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
          color: theme.textColor,
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
          color: theme.mutedTextColor,
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
  theme: ColorTheme;
  effect?: SpeakerEffect;
}> = ({ speakerGroup, frame, fps, theme, effect }) => {
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
        photoSize={440}
        nameSize={88}
        affiliationSize={58}
        theme={theme}
        effect={effect}
        cardIndex={0}
      />
      <div
        style={{
          color: theme.accentColor,
          fontSize: 72,
          fontWeight: 700,
          textAlign: "center",
          maxWidth: 1500,
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
  theme: ColorTheme;
  effect?: SpeakerEffect;
}> = ({ speakerGroup, frame, fps, theme, effect }) => {
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
            photoSize={360}
            nameSize={76}
            affiliationSize={50}
            theme={theme}
            effect={effect}
            cardIndex={i}
          />
        ))}
      </div>
      <div
        style={{
          color: theme.accentColor,
          fontSize: 66,
          fontWeight: 700,
          textAlign: "center",
          maxWidth: 1600,
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
  theme: ColorTheme;
  effect?: SpeakerEffect;
}> = ({ speakerGroup, frame, fps, theme, effect }) => {
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
            photoSize={290}
            nameSize={62}
            affiliationSize={44}
            theme={theme}
            effect={effect}
            cardIndex={i}
          />
        ))}
      </div>
      <div
        style={{
          color: theme.accentColor,
          fontSize: 62,
          fontWeight: 700,
          textAlign: "center",
          maxWidth: 1700,
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
  theme,
  effect = 'springCards',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const speakerCount = speakerGroup.speakers.length;

  const backgrounds = [
    `linear-gradient(180deg, ${theme.gradientFrom} 0%, ${theme.backgroundColor} 100%)`,
    `linear-gradient(180deg, ${theme.gradientTo} 0%, ${theme.backgroundColor} 100%)`,
    `linear-gradient(180deg, ${theme.gradientFrom} 0%, ${theme.gradientTo} 100%)`,
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
          theme={theme}
          effect={effect}
        />
      )}
      {speakerCount === 2 && (
        <TwoSpeakerLayout
          speakerGroup={speakerGroup}
          frame={frame}
          fps={fps}
          theme={theme}
          effect={effect}
        />
      )}
      {speakerCount >= 3 && (
        <ThreeSpeakerLayout
          speakerGroup={speakerGroup}
          frame={frame}
          fps={fps}
          theme={theme}
          effect={effect}
        />
      )}
    </AbsoluteFill>
  );
};
