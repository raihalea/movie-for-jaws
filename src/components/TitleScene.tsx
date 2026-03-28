import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import type { ColorTheme, TitleEffect } from "../types";

const { fontFamily } = loadFont();

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

  const renderSpringScale = () => (
    <>
      <div
        style={{
          width: 1100,
          height: 10,
          backgroundColor: theme.accentColor,
          marginBottom: 40,
          transform: `scaleX(${scale})`,
        }}
      />
      <div
        style={{
          color: theme.textColor,
          fontSize: 120,
          fontWeight: 900,
          textAlign: "center",
          maxWidth: 1600,
          lineHeight: 1.3,
          transform: `scale(${scale})`,
          opacity,
          padding: "0 60px",
        }}
      >
        {eventTitle}
      </div>
      <div
        style={{
          width: 1100,
          height: 10,
          backgroundColor: theme.accentColor,
          marginTop: 40,
          transform: `scaleX(${scale})`,
        }}
      />
    </>
  );

  const renderGlitch = () => {
    const redOffset = interpolate(frame, [0, 30], [10, 0], clampConfig);
    const cyanOffset = interpolate(frame, [0, 30], [-10, 0], clampConfig);

    return (
      <>
        <div
          style={{
            width: 1100,
            height: 10,
            backgroundColor: theme.accentColor,
            marginBottom: 40,
            transform: `scaleX(${scale})`,
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              color: theme.textColor,
              fontSize: 120,
              fontWeight: 900,
              textAlign: "center",
              maxWidth: 1600,
              lineHeight: 1.3,
              padding: "0 60px",
              transform: `translateX(${redOffset}px)`,
              textShadow: "2px 0 rgba(255,0,0,0.5)",
              opacity: 0.7,
            }}
          >
            {eventTitle}
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              color: theme.textColor,
              fontSize: 120,
              fontWeight: 900,
              textAlign: "center",
              maxWidth: 1600,
              lineHeight: 1.3,
              padding: "0 60px",
              transform: `translateX(${cyanOffset}px)`,
              textShadow: "-2px 0 rgba(0,255,255,0.5)",
              opacity: 0.7,
            }}
          >
            {eventTitle}
          </div>
          <div
            style={{
              position: "relative",
              color: theme.textColor,
              fontSize: 120,
              fontWeight: 900,
              textAlign: "center",
              maxWidth: 1600,
              lineHeight: 1.3,
              padding: "0 60px",
            }}
          >
            {eventTitle}
          </div>
        </div>
        <div
          style={{
            width: 1100,
            height: 10,
            backgroundColor: theme.accentColor,
            marginTop: 40,
            transform: `scaleX(${scale})`,
          }}
        />
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
          <div
            style={{
              width: 1100,
              height: 10,
              backgroundColor: theme.accentColor,
              marginBottom: 40,
            }}
          />
          <div
            style={{
              color: theme.textColor,
              fontSize: 120,
              fontWeight: 900,
              textAlign: "center",
              maxWidth: 1600,
              lineHeight: 1.3,
              padding: "0 60px",
            }}
          >
            {eventTitle}
          </div>
          <div
            style={{
              width: 1100,
              height: 10,
              backgroundColor: theme.accentColor,
              marginTop: 40,
            }}
          />
        </div>
      </div>
    );
  };

  const renderCinematic = () => {
    const topBarY = interpolate(frame, [0, 15], [-80, 0], clampConfig);
    const bottomBarY = interpolate(frame, [0, 15], [80, 0], clampConfig);
    const blurAmount = interpolate(frame, [10, 30], [8, 0], clampConfig);
    const textScale = interpolate(frame, [10, 30], [0.95, 1.0], clampConfig);
    const textOpacity = interpolate(frame, [10, 30], [0, 1], clampConfig);

    return (
      <>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 80,
            backgroundColor: "rgba(0,0,0,0.7)",
            transform: `translateY(${topBarY}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 80,
            backgroundColor: "rgba(0,0,0,0.7)",
            transform: `translateY(${bottomBarY}px)`,
          }}
        />
        <div
          style={{
            width: 1100,
            height: 10,
            backgroundColor: theme.accentColor,
            marginBottom: 40,
            transform: `scaleX(${scale})`,
          }}
        />
        <div
          style={{
            color: theme.textColor,
            fontSize: 120,
            fontWeight: 900,
            textAlign: "center",
            maxWidth: 1600,
            lineHeight: 1.3,
            padding: "0 60px",
            filter: `blur(${blurAmount}px)`,
            transform: `scale(${textScale})`,
            opacity: textOpacity,
          }}
        >
          {eventTitle}
        </div>
        <div
          style={{
            width: 1100,
            height: 10,
            backgroundColor: theme.accentColor,
            marginTop: 40,
            transform: `scaleX(${scale})`,
          }}
        />
      </>
    );
  };

  const renderNeonOutline = () => {
    const neonOpacity = interpolate(frame, [0, 20], [0, 1], clampConfig);
    const glowRadius = 10 + Math.sin(frame * 0.15) * 10 + 10;

    return (
      <>
        <div
          style={{
            width: 1100,
            height: 10,
            backgroundColor: theme.accentColor,
            marginBottom: 40,
            transform: `scaleX(${scale})`,
          }}
        />
        <div
          style={{
            color: theme.textColor,
            fontSize: 120,
            fontWeight: 900,
            textAlign: "center",
            maxWidth: 1600,
            lineHeight: 1.3,
            padding: "0 60px",
            opacity: neonOpacity,
            transform: `scale(${scale})`,
            textShadow: `0 0 ${glowRadius}px ${theme.accentColor}, 0 0 ${glowRadius * 2}px ${theme.accentColor}`,
          }}
        >
          {eventTitle}
        </div>
        <div
          style={{
            width: 1100,
            height: 10,
            backgroundColor: theme.accentColor,
            marginTop: 40,
            transform: `scaleX(${scale})`,
          }}
        />
      </>
    );
  };

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.backgroundColor} 50%, ${theme.gradientTo} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      {effect === "springScale" && renderSpringScale()}
      {effect === "glitch" && renderGlitch()}
      {effect === "wipeIn" && renderWipeIn()}
      {effect === "cinematic" && renderCinematic()}
      {effect === "neonOutline" && renderNeonOutline()}
    </AbsoluteFill>
  );
};
