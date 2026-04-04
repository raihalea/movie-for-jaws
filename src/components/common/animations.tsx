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

export const ElasticScale: React.FC<{
  delay?: number;
  children: React.ReactNode;
}> = ({ delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: { damping: 8, stiffness: 200, mass: 0.4 },
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
