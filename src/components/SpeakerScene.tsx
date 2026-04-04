import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AutoSizeText } from "./common/AutoSizeText";
import { AnimatedDivider, AudioPulseFrame } from "./common/DecorativeElements";
import { SceneWrapper } from "./common/SceneWrapper";
import type { SpeakerGroup, Speaker, ColorTheme, SpeakerEffect } from "../types";

/** Panel with audio-reactive pulsing border */
const PulsePanel: React.FC<{
  color: string;
  borderRadius?: number;
  padding: string;
  gap?: number;
  children: React.ReactNode;
}> = ({ color, borderRadius = 24, padding, gap, children }) => (
  <div
    style={{
      position: "relative",
      background: "rgba(255,255,255,0.06)",
      borderRadius,
      padding,
      boxShadow: "0 8px 32px rgba(0,0,0,0.04)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap,
    }}
  >
    <AudioPulseFrame color={color} borderRadius={borderRadius} />
    {children}
  </div>
);

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
  nameMaxWidth: number;
  theme: ColorTheme;
  effect?: SpeakerEffect;
  cardIndex?: number;
}> = ({ speaker, frame, fps, delay, photoSize, nameSize, affiliationSize, nameMaxWidth, theme, effect = 'springCards', cardIndex = 0 }) => {
  // springCards: original spring-based animation
  // Snap to exactly 1.0 when close enough to prevent sub-pixel text jitter
  const snap = (v: number) => (Math.abs(v - 1) < 0.005 ? 1 : v);
  const photoScale = effect === 'springCards'
    ? snap(spring({
        fps,
        frame: Math.max(0, frame - delay),
        config: { damping: 8, stiffness: 200, mass: 0.5 },
      }))
    : 1;
  const nameScale = effect === 'springCards'
    ? snap(spring({
        fps,
        frame: Math.max(0, frame - delay - 8),
        config: { damping: 14, stiffness: 80, mass: 0.6 },
      }))
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

  // Photo glow animation
  const glowRadius = 10 + 8 * Math.sin(frame * 0.06 + cardIndex * 1.5);

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
  }

  const subAffiliationSize = Math.round(affiliationSize * 0.75);

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
          boxShadow: `0 0 ${glowRadius}px ${theme.accentColor}40`,
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
          transform: `scale(${nameScale})`,
          textAlign: "center",
        }}
      >
        <AutoSizeText
          text={speaker.name}
          maxFontSize={nameSize}
          minFontSize={Math.round(nameSize * 0.55)}
          maxWidth={nameMaxWidth}
          fontWeight={700}
          style={{ color: theme.textColor }}
        />
      </div>
      <div
        style={{
          opacity: affiliationOpacity,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <AutoSizeText
          text={speaker.affiliation}
          maxFontSize={affiliationSize}
          minFontSize={Math.round(affiliationSize * 0.55)}
          maxWidth={nameMaxWidth}
          fontWeight={700}
          style={{ color: theme.mutedTextColor, fontWeight: 400 }}
        />
        {speaker.subAffiliation && (
          <AutoSizeText
            text={speaker.subAffiliation}
            maxFontSize={subAffiliationSize}
            minFontSize={Math.round(subAffiliationSize * 0.6)}
            maxWidth={nameMaxWidth}
            fontWeight={700}
            style={{ color: theme.mutedTextColor, fontWeight: 400, opacity: 0.8 }}
          />
        )}
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
  const subTitleFontSize = 34;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 24,
      }}
    >
      <PulsePanel color={theme.accentColor} padding="40px 60px">
        <SpeakerCard
          speaker={speakerGroup.speakers[0]}
          frame={frame}
          fps={fps}
          delay={5}
          photoSize={380}
          nameSize={72}
          affiliationSize={46}
          nameMaxWidth={750}
          theme={theme}
          effect={effect}
          cardIndex={0}
        />
      </PulsePanel>
      <AnimatedDivider width={800} color={theme.accentColor} delay={25} thickness={3} />
      <div
        style={{
          opacity: titleOpacity,
          padding: "0 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <AutoSizeText
          text={speakerGroup.talkTitle}
          maxFontSize={62}
          minFontSize={32}
          maxWidth={1340}
          fontWeight={700}
          style={{ color: theme.accentColor }}
        />
        {speakerGroup.subTalkTitle && (
          <AutoSizeText
            text={speakerGroup.subTalkTitle}
            maxFontSize={subTitleFontSize}
            minFontSize={24}
            maxWidth={1340}
            fontWeight={700}
            style={{ color: theme.accentColor, opacity: 0.8 }}
          />
        )}
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
  const subTitleFontSize = 30;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 24,
      }}
    >
      <PulsePanel color={theme.accentColor} padding="40px 60px" gap={100}>
        {speakerGroup.speakers.map((speaker, i) => (
          <SpeakerCard
            key={i}
            speaker={speaker}
            frame={frame}
            fps={fps}
            delay={5 + i * 10}
            photoSize={310}
            nameSize={62}
            affiliationSize={42}
            nameMaxWidth={400}
            theme={theme}
            effect={effect}
            cardIndex={i}
          />
        ))}
      </PulsePanel>
      <AnimatedDivider width={900} color={theme.accentColor} delay={30} thickness={3} />
      <div
        style={{
          opacity: titleOpacity,
          padding: "0 80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <AutoSizeText
          text={speakerGroup.talkTitle}
          maxFontSize={56}
          minFontSize={30}
          maxWidth={1440}
          fontWeight={700}
          style={{ color: theme.accentColor }}
        />
        {speakerGroup.subTalkTitle && (
          <AutoSizeText
            text={speakerGroup.subTalkTitle}
            maxFontSize={subTitleFontSize}
            minFontSize={22}
            maxWidth={1440}
            fontWeight={700}
            style={{ color: theme.accentColor, opacity: 0.8 }}
          />
        )}
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
  const subTitleFontSize = 28;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 20,
      }}
    >
      <PulsePanel color={theme.accentColor} padding="30px 50px" gap={60}>
        {speakerGroup.speakers.map((speaker, i) => (
          <SpeakerCard
            key={i}
            speaker={speaker}
            frame={frame}
            fps={fps}
            delay={5 + i * 8}
            photoSize={240}
            nameSize={50}
            affiliationSize={34}
            nameMaxWidth={340}
            theme={theme}
            effect={effect}
            cardIndex={i}
          />
        ))}
      </PulsePanel>
      <AnimatedDivider width={1000} color={theme.accentColor} delay={35} thickness={3} />
      <div
        style={{
          opacity: titleOpacity,
          padding: "0 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <AutoSizeText
          text={speakerGroup.talkTitle}
          maxFontSize={52}
          minFontSize={28}
          maxWidth={1580}
          fontWeight={700}
          style={{ color: theme.accentColor }}
        />
        {speakerGroup.subTalkTitle && (
          <AutoSizeText
            text={speakerGroup.subTalkTitle}
            maxFontSize={subTitleFontSize}
            minFontSize={20}
            maxWidth={1580}
            fontWeight={700}
            style={{ color: theme.accentColor, opacity: 0.8 }}
          />
        )}
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
    <SceneWrapper
      theme={theme}
      background={backgrounds[index % backgrounds.length]}
      backgroundIntensity={0.5}
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
    </SceneWrapper>
  );
};
