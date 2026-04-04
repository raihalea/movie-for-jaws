import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { AnimatedBackground } from "./AnimatedBackground";
import { CornerAccent } from "./DecorativeElements";
import { fontFamily } from "../../utils/font";
import type { ColorTheme } from "../../types";

interface SceneWrapperProps {
  theme: ColorTheme;
  background: string;
  backgroundIntensity?: number;
  showCornerAccents?: boolean;
  cornerAccentDelay?: number;
  children: React.ReactNode;
}

export const SceneWrapper: React.FC<SceneWrapperProps> = ({
  theme,
  background,
  backgroundIntensity = 0.7,
  showCornerAccents = true,
  cornerAccentDelay = 5,
  children,
}) => {
  const frame = useCurrentFrame();

  // Slowly rotating gradient angle for subtle movement
  const angle = interpolate(frame, [0, 300], [0, 10], {
    extrapolateRight: "extend",
  });

  // Parse and animate the background gradient angle
  const animatedBackground = background.includes("linear-gradient")
    ? background.replace(
        /linear-gradient\((\d+)deg/,
        (_, baseAngle) =>
          `linear-gradient(${parseFloat(baseAngle) + angle}deg`,
      )
    : background;

  return (
    <AbsoluteFill
      style={{
        background: animatedBackground,
        fontFamily,
      }}
    >
      <AnimatedBackground theme={theme} intensity={backgroundIntensity} />
      {showCornerAccents && (
        <>
          <CornerAccent
            position="topLeft"
            color={theme.accentColor}
            delay={cornerAccentDelay}
          />
          <CornerAccent
            position="topRight"
            color={theme.accentColor}
            delay={cornerAccentDelay + 3}
          />
          <CornerAccent
            position="bottomLeft"
            color={theme.accentColor}
            delay={cornerAccentDelay + 6}
          />
          <CornerAccent
            position="bottomRight"
            color={theme.accentColor}
            delay={cornerAccentDelay + 9}
          />
        </>
      )}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
