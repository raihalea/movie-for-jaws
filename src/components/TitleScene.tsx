import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";

const { fontFamily } = loadFont();

interface TitleSceneProps {
  eventTitle: string;
}

export const TitleScene: React.FC<TitleSceneProps> = ({ eventTitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 80, mass: 0.6 },
  });
  const opacity = Math.min(1, frame / 15);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          width: 800,
          height: 6,
          backgroundColor: "#FF9900",
          marginBottom: 40,
          transform: `scaleX(${scale})`,
        }}
      />
      <div
        style={{
          color: "#ffffff",
          fontSize: 72,
          fontWeight: 900,
          textAlign: "center",
          maxWidth: 1400,
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
          width: 800,
          height: 6,
          backgroundColor: "#FF9900",
          marginTop: 40,
          transform: `scaleX(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};
