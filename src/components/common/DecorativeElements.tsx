import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { useAudioPulse } from "../../utils/AudioPulseContext";

// ─── Corner Accent ─────────────────────────────────────────────────

interface CornerAccentProps {
  position: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  color: string;
  delay?: number;
  size?: number;
  thickness?: number;
}

export const CornerAccent: React.FC<CornerAccentProps> = ({
  position,
  color,
  delay = 5,
  size = 120,
  thickness = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { bass } = useAudioPulse();

  const progress = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: { damping: 12, stiffness: 120, mass: 0.4 },
  });

  const beatBoost = bass * 30;
  const lineLength = size * progress + beatBoost;

  const isTop = position === "topLeft" || position === "topRight";
  const isLeft = position === "topLeft" || position === "bottomLeft";

  const baseGlow = 6;
  const beatGlow = bass * 25;
  const glowRadius = baseGlow + beatGlow;
  const boxShadow = `0 0 ${glowRadius}px ${color}90, 0 0 ${glowRadius * 2}px ${color}30`;

  const lineOpacity = 0.5 + bass * 0.5;
  const beatThickness = thickness + bass * 3;

  const dotScale = 1 + bass * 1.2;
  const dotOpacity = 0.5 + bass * 0.5;
  const dotGlow = 8 + bass * 35;
  const dotSize = 12 * dotScale;

  const style: React.CSSProperties = {
    position: "absolute",
    top: isTop ? 36 : undefined,
    bottom: isTop ? undefined : 36,
    left: isLeft ? 36 : undefined,
    right: isLeft ? undefined : 36,
    width: lineLength,
    height: lineLength,
    pointerEvents: "none",
  };

  const hStyle: React.CSSProperties = {
    position: "absolute",
    [isTop ? "top" : "bottom"]: 0,
    [isLeft ? "left" : "right"]: 0,
    width: lineLength,
    height: beatThickness,
    background: `linear-gradient(${isLeft ? "to right" : "to left"}, ${color}, ${color}20)`,
    opacity: lineOpacity,
    borderRadius: beatThickness / 2,
    boxShadow,
  };

  const vStyle: React.CSSProperties = {
    position: "absolute",
    [isTop ? "top" : "bottom"]: 0,
    [isLeft ? "left" : "right"]: 0,
    width: beatThickness,
    height: lineLength,
    background: `linear-gradient(${isTop ? "to bottom" : "to top"}, ${color}, ${color}20)`,
    opacity: lineOpacity,
    borderRadius: beatThickness / 2,
    boxShadow,
  };

  const dotStyle: React.CSSProperties = {
    position: "absolute",
    [isTop ? "top" : "bottom"]: -dotSize / 2 + beatThickness / 2,
    [isLeft ? "left" : "right"]: -dotSize / 2 + beatThickness / 2,
    width: dotSize,
    height: dotSize,
    borderRadius: "50%",
    backgroundColor: color,
    opacity: dotOpacity,
    boxShadow: `0 0 ${dotGlow}px ${color}cc, 0 0 ${dotGlow * 2}px ${color}40`,
  };

  return (
    <div style={style}>
      <div style={hStyle} />
      <div style={vStyle} />
      <div style={dotStyle} />
    </div>
  );
};

// ─── Audio Pulse Frame ─────────────────────────────────────────────
// A rounded-rect border that uniformly expands and glows with the bass.
// No per-frequency variation — the entire frame pulses together.

interface AudioPulseFrameProps {
  color: string;
  delay?: number;
  borderRadius?: number;
}

// Number of ripple layers that cycle continuously
const RIPPLE_COUNT = 4;
// Duration of one ripple cycle in frames
const RIPPLE_CYCLE = 30;

export const AudioPulseFrame: React.FC<AudioPulseFrameProps> = ({
  color,
  delay = 3,
  borderRadius = 24,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { bass } = useAudioPulse();

  const entryProgress = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  // Bass drives uniform expansion of the main border
  const expand = bass * 10;
  const glowRadius = 4 + bass * 20;
  const borderOpacity = (0.25 + bass * 0.45) * entryProgress;
  const borderWidth = 2 + bass * 2;

  // Ripples: staggered rings expanding outward, amplitude driven by bass
  const ripples = [];
  for (let i = 0; i < RIPPLE_COUNT; i++) {
    // Each ripple is offset in phase so they stagger
    const phase = ((frame - delay + i * (RIPPLE_CYCLE / RIPPLE_COUNT)) % RIPPLE_CYCLE) / RIPPLE_CYCLE;
    // phase goes 0→1 over one cycle
    const rippleExpand = phase * 35 * (0.3 + bass * 0.7);
    const rippleOpacity = (1 - phase) * (0.15 + bass * 0.25) * entryProgress;
    const rippleBorderWidth = Math.max(0.5, (1 - phase) * 2);

    if (rippleOpacity > 0.01) {
      ripples.push(
        <div
          key={i}
          style={{
            position: "absolute",
            inset: -(expand + rippleExpand),
            borderRadius: borderRadius + (expand + rippleExpand) * 0.3,
            border: `${rippleBorderWidth}px solid ${color}`,
            opacity: rippleOpacity,
            pointerEvents: "none",
          }}
        />,
      );
    }
  }

  return (
    <>
      {ripples}
      <div
        style={{
          position: "absolute",
          inset: -expand,
          borderRadius: borderRadius + expand * 0.3,
          border: `${borderWidth}px solid ${color}`,
          opacity: borderOpacity,
          boxShadow: `0 0 ${glowRadius}px ${color}50, inset 0 0 ${glowRadius * 0.5}px ${color}15`,
          pointerEvents: "none",
        }}
      />
    </>
  );
};

// ─── Animated Divider ──────────────────────────────────────────────

interface AnimatedDividerProps {
  width: number;
  color: string;
  delay?: number;
  thickness?: number;
}

export const AnimatedDivider: React.FC<AnimatedDividerProps> = ({
  width,
  color,
  delay = 0,
  thickness = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { bass } = useAudioPulse();

  const scaleX = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: { damping: 14, stiffness: 80, mass: 0.6 },
  });

  const opacity = interpolate(frame, [delay, delay + 10], [0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const beatThickness = thickness + bass * 2;
  const beatGlow = bass * 15;

  return (
    <div
      style={{
        width,
        height: beatThickness,
        backgroundColor: color,
        transform: `scaleX(${scaleX})`,
        transformOrigin: "center",
        opacity: opacity + bass * 0.3,
        borderRadius: beatThickness / 2,
        boxShadow: beatGlow > 0 ? `0 0 ${beatGlow}px ${color}60` : undefined,
      }}
    />
  );
};
