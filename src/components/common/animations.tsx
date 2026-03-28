import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

export const FadeIn: React.FC<{
  durationInFrames?: number;
  delay?: number;
  children: React.ReactNode;
}> = ({ durationInFrames = 30, delay = 0, children }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return <div style={{ opacity }}>{children}</div>;
};

export const SlideUp: React.FC<{
  durationInFrames?: number;
  delay?: number;
  distance?: number;
  children: React.ReactNode;
}> = ({ durationInFrames = 30, delay = 0, distance = 50, children }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [delay, delay + durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const translateY = (1 - progress) * distance;
  const opacity = progress;

  return (
    <div style={{ transform: `translateY(${translateY}px)`, opacity }}>
      {children}
    </div>
  );
};

export const ScaleIn: React.FC<{
  delay?: number;
  children: React.ReactNode;
}> = ({ delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
};

export const ParticleField: React.FC<{
  count?: number;
  color: string;
  width: number;
  height: number;
}> = ({ count = 14, color, width, height }) => {
  const frame = useCurrentFrame();

  const particles = Array.from({ length: count }, (_, i) => {
    // Deterministic positions based on index
    const angle = (i / count) * Math.PI * 2;
    const radius = 300 + (i % 3) * 120;
    const startX = Math.cos(angle) * radius;
    const startY = Math.sin(angle) * radius;
    const size = 8 + (i % 4) * 4;
    const delay = i * 2;

    const progress = interpolate(
      frame,
      [delay, delay + 30],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    const x = startX * (1 - progress);
    const y = startY * (1 - progress);
    const opacity = interpolate(
      frame,
      [delay, delay + 15, delay + 25, delay + 30],
      [0, 0.8, 0.8, 0.3],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: width / 2 + x - size / 2,
          top: height / 2 + y - size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: color,
          opacity,
        }}
      />
    );
  });

  return (
    <div style={{ position: "absolute", width, height, top: 0, left: 0 }}>
      {particles}
    </div>
  );
};

export const RippleRing: React.FC<{
  delay?: number;
  maxSize?: number;
  color: string;
  thickness?: number;
}> = ({ delay = 0, maxSize = 800, color, thickness = 3 }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [delay, delay + 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const size = progress * maxSize;
  const opacity = interpolate(
    frame,
    [delay, delay + 10, delay + 30, delay + 40],
    [0, 0.6, 0.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `${thickness}px solid ${color}`,
        opacity,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

export const SpotlightReveal: React.FC<{
  delay?: number;
  durationInFrames?: number;
  children: React.ReactNode;
}> = ({ delay = 0, durationInFrames = 30, children }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [delay, delay + durationInFrames],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        clipPath: `circle(${progress}% at 50% 50%)`,
      }}
    >
      {children}
    </div>
  );
};
