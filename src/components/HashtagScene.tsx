import React from "react";
import {
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { AutoSizeText } from "./common/AutoSizeText";
import { SceneWrapper } from "./common/SceneWrapper";
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

  // Gentle wobble for the X icon
  const iconWobble = 3 * Math.sin(frame * 0.06);

  // Bouncing arrow for call-to-action
  const arrowBounce = 5 * Math.sin(frame * 0.12);

  const renderSpringBounce = () => {
    const iconScale = spring({
      fps,
      frame,
      config: { damping: 8, stiffness: 200, mass: 0.5 },
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
            fontSize: 170,
            transform: `scale(${iconScale}) rotate(${iconWobble}deg)`,
            marginBottom: 40,
          }}
        >
          𝕏
        </div>
        <div style={{ transform: `scale(${hashtagScale})` }}>
          <AutoSizeText
            text={hashtag}
            maxFontSize={120}
            minFontSize={60}
            maxWidth={1700}
            fontWeight={900}
            style={{ color: theme.accentColor }}
          />
        </div>
        <div
          style={{
            color: theme.mutedTextColor,
            fontSize: 54,
            marginTop: 40,
            opacity: subtitleOpacity,
            textAlign: "center",
          }}
        >
          イベントの様子をポストしよう!
        </div>
        <div
          style={{
            fontSize: 40,
            marginTop: 16,
            opacity: subtitleOpacity * 0.6,
            transform: `translateY(${arrowBounce}px)`,
          }}
        >
          ↓
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
            fontSize: 170,
            marginBottom: 40,
            transform: `rotateY(${iconRotate}deg) rotate(${iconWobble}deg)`,
            opacity: iconOpacity,
          }}
        >
          𝕏
        </div>
        <div
          style={{
            transform: `rotateY(${hashtagRotate}deg)`,
            opacity: hashtagOpacity,
          }}
        >
          <AutoSizeText
            text={hashtag}
            maxFontSize={120}
            minFontSize={60}
            maxWidth={1700}
            fontWeight={900}
            style={{ color: theme.accentColor }}
          />
        </div>
        <div
          style={{
            color: theme.mutedTextColor,
            fontSize: 54,
            marginTop: 40,
            textAlign: "center",
            transform: `rotateY(${subtitleRotate}deg)`,
            opacity: subtitleOpacity,
          }}
        >
          イベントの様子をポストしよう!
        </div>
        <div
          style={{
            fontSize: 40,
            marginTop: 16,
            opacity: subtitleOpacity * 0.6,
            transform: `translateY(${arrowBounce}px)`,
          }}
        >
          ↓
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
    const pulseScale = 1 + 0.02 * Math.sin(frame * 0.1);

    return (
      <>
        <div
          style={{
            fontSize: 170,
            marginBottom: 40,
            opacity: iconOpacity,
            transform: `rotate(${iconWobble}deg)`,
          }}
        >
          𝕏
        </div>
        <div
          style={{
            opacity: hashtagOpacity,
            textShadow: `0 0 ${glowRadius}px ${theme.accentColor}`,
            transform: `scale(${pulseScale})`,
          }}
        >
          <AutoSizeText
            text={hashtag}
            maxFontSize={120}
            minFontSize={60}
            maxWidth={1700}
            fontWeight={900}
            style={{ color: theme.accentColor }}
          />
        </div>
        <div
          style={{
            color: theme.mutedTextColor,
            fontSize: 54,
            marginTop: 40,
            textAlign: "center",
            opacity: subtitleOpacity,
          }}
        >
          イベントの様子をポストしよう!
        </div>
        <div
          style={{
            fontSize: 40,
            marginTop: 16,
            opacity: subtitleOpacity * 0.6,
            transform: `translateY(${arrowBounce}px)`,
          }}
        >
          ↓
        </div>
      </>
    );
  };

  return (
    <SceneWrapper
      theme={theme}
      background={`linear-gradient(135deg, ${theme.gradientFrom} 0%, ${theme.backgroundColor} 100%)`}
      backgroundIntensity={0.8}
    >
      {effect === "springBounce" && renderSpringBounce()}
      {effect === "rotateIn" && renderRotateIn()}
      {effect === "pulseGlow" && renderPulseGlow()}
    </SceneWrapper>
  );
};
