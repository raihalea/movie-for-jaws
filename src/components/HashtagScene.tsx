import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { fontFamily } from "../utils/font";
import type { ColorTheme, HashtagEffect } from "../types";

interface HashtagSceneProps {
  hashtag: string;
  theme: ColorTheme;
  effect?: HashtagEffect;
}

export const HashtagScene: React.FC<HashtagSceneProps> = ({
  hashtag,
  theme,
  effect = "springBounce",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const clampConfig = {
    extrapolateLeft: "clamp" as const,
    extrapolateRight: "clamp" as const,
  };

  const renderSpringBounce = () => {
    const iconScale = spring({
      fps,
      frame,
      config: { damping: 12, stiffness: 100, mass: 0.5 },
    });
    const hashtagScale = spring({
      fps,
      frame: Math.max(0, frame - 10),
      config: { damping: 14, stiffness: 80, mass: 0.6 },
    });
    const subtitleOpacity = Math.min(1, Math.max(0, (frame - 25) / 15));

    return (
      <>
        <div
          style={{
            fontSize: 200,
            transform: `scale(${iconScale})`,
            marginBottom: 40,
          }}
        >
          𝕏
        </div>
        <div
          style={{
            color: theme.accentColor,
            fontSize: 140,
            fontWeight: 900,
            transform: `scale(${hashtagScale})`,
            textAlign: "center",
          }}
        >
          {hashtag}
        </div>
        <div
          style={{
            color: theme.mutedTextColor,
            fontSize: 64,
            marginTop: 40,
            opacity: subtitleOpacity,
            textAlign: "center",
          }}
        >
          イベントの様子をポストしよう!
        </div>
      </>
    );
  };

  const renderRotateIn = () => {
    const iconRotate = interpolate(frame, [0, 20], [90, 0], clampConfig);
    const iconOpacity = interpolate(frame, [0, 20], [0, 1], clampConfig);
    const hashtagRotate = interpolate(frame, [10, 30], [90, 0], clampConfig);
    const hashtagOpacity = interpolate(frame, [10, 30], [0, 1], clampConfig);
    const subtitleRotate = interpolate(frame, [25, 45], [90, 0], clampConfig);
    const subtitleOpacity = interpolate(frame, [25, 45], [0, 1], clampConfig);

    return (
      <>
        <div
          style={{
            fontSize: 200,
            marginBottom: 40,
            transform: `rotateY(${iconRotate}deg)`,
            opacity: iconOpacity,
          }}
        >
          𝕏
        </div>
        <div
          style={{
            color: theme.accentColor,
            fontSize: 140,
            fontWeight: 900,
            textAlign: "center",
            transform: `rotateY(${hashtagRotate}deg)`,
            opacity: hashtagOpacity,
          }}
        >
          {hashtag}
        </div>
        <div
          style={{
            color: theme.mutedTextColor,
            fontSize: 64,
            marginTop: 40,
            textAlign: "center",
            transform: `rotateY(${subtitleRotate}deg)`,
            opacity: subtitleOpacity,
          }}
        >
          イベントの様子をポストしよう!
        </div>
      </>
    );
  };

  const renderShakeReveal = () => {
    const iconOpacity = interpolate(frame, [0, 15], [0, 1], clampConfig);
    const hashtagOpacity = interpolate(frame, [8, 23], [0, 1], clampConfig);
    const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], clampConfig);
    const shakeAmount = interpolate(frame, [8, 50], [15, 0], clampConfig);
    const shakeX = Math.sin(frame * 1.5) * shakeAmount;

    return (
      <>
        <div
          style={{
            fontSize: 200,
            marginBottom: 40,
            opacity: iconOpacity,
          }}
        >
          𝕏
        </div>
        <div
          style={{
            color: theme.accentColor,
            fontSize: 140,
            fontWeight: 900,
            textAlign: "center",
            opacity: hashtagOpacity,
            transform: `translateX(${shakeX}px)`,
          }}
        >
          {hashtag}
        </div>
        <div
          style={{
            color: theme.mutedTextColor,
            fontSize: 64,
            marginTop: 40,
            textAlign: "center",
            opacity: subtitleOpacity,
          }}
        >
          イベントの様子をポストしよう!
        </div>
      </>
    );
  };

  const renderPulseGlow = () => {
    const iconOpacity = interpolate(frame, [0, 20], [0, 1], clampConfig);
    const hashtagOpacity = interpolate(frame, [10, 30], [0, 1], clampConfig);
    const subtitleOpacity = interpolate(frame, [25, 45], [0, 1], clampConfig);
    const glowIntensity = Math.sin(frame * 0.1) * 0.5 + 0.5;
    const glowRadius = 10 + glowIntensity * 20;

    return (
      <>
        <div
          style={{
            fontSize: 200,
            marginBottom: 40,
            opacity: iconOpacity,
          }}
        >
          𝕏
        </div>
        <div
          style={{
            color: theme.accentColor,
            fontSize: 140,
            fontWeight: 900,
            textAlign: "center",
            opacity: hashtagOpacity,
            textShadow: `0 0 ${glowRadius}px ${theme.accentColor}`,
          }}
        >
          {hashtag}
        </div>
        <div
          style={{
            color: theme.mutedTextColor,
            fontSize: 64,
            marginTop: 40,
            textAlign: "center",
            opacity: subtitleOpacity,
          }}
        >
          イベントの様子をポストしよう!
        </div>
      </>
    );
  };

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.backgroundColor} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      {effect === "springBounce" && renderSpringBounce()}
      {effect === "rotateIn" && renderRotateIn()}
      {effect === "pulseGlow" && renderPulseGlow()}
      {effect === "shakeReveal" && renderShakeReveal()}
    </AbsoluteFill>
  );
};
