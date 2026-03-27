import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";

const { fontFamily } = loadFont();

interface HashtagSceneProps {
  hashtag: string;
}

export const HashtagScene: React.FC<HashtagSceneProps> = ({ hashtag }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          fontSize: 120,
          transform: `scale(${iconScale})`,
          marginBottom: 30,
        }}
      >
        𝕏
      </div>
      <div
        style={{
          color: "#FF9900",
          fontSize: 80,
          fontWeight: 900,
          transform: `scale(${hashtagScale})`,
          textAlign: "center",
        }}
      >
        {hashtag}
      </div>
      <div
        style={{
          color: "#a0a0b0",
          fontSize: 36,
          marginTop: 30,
          opacity: subtitleOpacity,
          textAlign: "center",
        }}
      >
        イベントの様子をポストしよう!
      </div>
    </AbsoluteFill>
  );
};
