import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { ColorTheme } from "../../types";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  phase: number;
  shape: "circle" | "diamond";
  baseOpacity: number;
}

interface AnimatedBackgroundProps {
  theme: ColorTheme;
  intensity?: number;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  theme,
  intensity = 0.7,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo<Particle[]>(() => {
    const count = Math.round(12 + intensity * 8);
    return Array.from({ length: count }, (_, i) => {
      const seed = (i + 1) * 137.508;
      return {
        x: ((seed * 7.3) % 1920),
        y: ((seed * 3.7) % 1080),
        size: 8 + ((seed * 2.1) % 32),
        speed: 0.3 + ((seed * 0.9) % 0.7),
        phase: (seed * 1.3) % (Math.PI * 2),
        shape: i % 3 === 0 ? "diamond" as const : "circle" as const,
        baseOpacity: (0.05 + ((seed * 0.4) % 0.07)) * intensity,
      };
    });
  }, [intensity]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {particles.map((p, i) => {
        const drift = frame * p.speed * 0.5;
        const yPos = ((p.y - drift) % 1200 + 1200) % 1200 - 60;
        const xSway = Math.sin(frame * 0.02 * p.speed + p.phase) * 30;
        const opacity =
          p.baseOpacity +
          0.03 * Math.sin(frame * 0.03 + p.phase) * intensity;
        const scale = 1 + 0.15 * Math.sin(frame * 0.02 + p.phase);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x + xSway,
              top: yPos,
              width: p.size,
              height: p.size,
              backgroundColor: theme.accentColor,
              borderRadius: p.shape === "circle" ? "50%" : 0,
              transform:
                p.shape === "diamond"
                  ? `rotate(45deg) scale(${scale})`
                  : `scale(${scale})`,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
