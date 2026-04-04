import React from "react";
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { AutoSizeText } from "./common/AutoSizeText";
import { AnimatedDivider } from "./common/DecorativeElements";
import { SceneWrapper } from "./common/SceneWrapper";
import type { ColorTheme, TitleEffect } from "../types";

interface TitleSceneProps {
  eventTitle: string;
  theme: ColorTheme;
  effect?: TitleEffect;
}

export const TitleScene: React.FC<TitleSceneProps> = ({
  eventTitle,
  theme,
  effect = "springScale",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 80, mass: 0.6 },
  });
  const opacity = Math.min(1, frame / 15);

  const clampConfig = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
  };

  const titleStyle: React.CSSProperties = {
    color: theme.textColor,
    textShadow: "0 4px 20px rgba(0,0,0,0.08)",
  };

  const renderSpringScale = () => (
    <>
      <div style={{ marginBottom: 40 }}>
        <AnimatedDivider width={1100} color={theme.accentColor} thickness={6} />
      </div>
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          padding: "0 60px",
        }}
      >
        <AutoSizeText
          text={eventTitle}
          maxFontSize={100}
          minFontSize={40}
          maxWidth={1600}
          fontWeight={900}
          style={titleStyle}
        />
      </div>
      <div style={{ marginTop: 40 }}>
        <AnimatedDivider width={1100} color={theme.accentColor} delay={5} thickness={6} />
      </div>
    </>
  );

  const renderGlitch = () => {
    const redOffset = interpolate(frame, [0, 30], [10, 0], clampConfig);
    const cyanOffset = interpolate(frame, [0, 30], [-10, 0], clampConfig);

    return (
      <>
        <div style={{ marginBottom: 40 }}>
          <AnimatedDivider width={1100} color={theme.accentColor} thickness={6} />
        </div>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: `translateX(${redOffset}px)`,
              textShadow: "2px 0 rgba(255,0,0,0.5)",
              opacity: 0.7,
              padding: "0 60px",
            }}
          >
            <AutoSizeText
              text={eventTitle}
              maxFontSize={100}
              minFontSize={40}
              maxWidth={1600}
              fontWeight={900}
              style={{ color: theme.textColor }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: `translateX(${cyanOffset}px)`,
              textShadow: "-2px 0 rgba(0,255,255,0.5)",
              opacity: 0.7,
              padding: "0 60px",
            }}
          >
            <AutoSizeText
              text={eventTitle}
              maxFontSize={100}
              minFontSize={40}
              maxWidth={1600}
              fontWeight={900}
              style={{ color: theme.textColor }}
            />
          </div>
          <div style={{ position: "relative", padding: "0 60px" }}>
            <AutoSizeText
              text={eventTitle}
              maxFontSize={100}
              minFontSize={40}
              maxWidth={1600}
              fontWeight={900}
              style={titleStyle}
            />
          </div>
        </div>
        <div style={{ marginTop: 40 }}>
          <AnimatedDivider width={1100} color={theme.accentColor} delay={5} thickness={6} />
        </div>
      </>
    );
  };

  const renderWipeIn = () => {
    const progress = interpolate(frame, [0, 30], [0, 100], clampConfig);

    return (
      <div style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ marginBottom: 40 }}>
            <AnimatedDivider width={1100} color={theme.accentColor} delay={0} thickness={6} />
          </div>
          <div style={{ padding: "0 60px" }}>
            <AutoSizeText
              text={eventTitle}
              maxFontSize={100}
              minFontSize={40}
              maxWidth={1600}
              fontWeight={900}
              style={titleStyle}
            />
          </div>
          <div style={{ marginTop: 40 }}>
            <AnimatedDivider width={1100} color={theme.accentColor} delay={0} thickness={6} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <SceneWrapper
      theme={theme}
      background={`linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.backgroundColor} 50%, ${theme.gradientTo} 100%)`}
      backgroundIntensity={0.6}
    >
      {effect === "springScale" && renderSpringScale()}
      {effect === "glitch" && renderGlitch()}
      {effect === "wipeIn" && renderWipeIn()}
    </SceneWrapper>
  );
};
