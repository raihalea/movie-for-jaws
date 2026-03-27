import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ScaleIn, FadeIn } from "./common/animations";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";

const { fontFamily } = loadFont();

interface IntroSceneProps {
  jawsugIconUrl?: string;
  chapterIconUrl?: string;
  chapterName: string;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  jawsugIconUrl,
  chapterIconUrl,
  chapterName,
}) => {
  const jawsugSrc = jawsugIconUrl
    ? jawsugIconUrl.startsWith("http")
      ? jawsugIconUrl
      : staticFile(jawsugIconUrl)
    : staticFile("jaws-ug-icon.svg");

  const chapterSrc = chapterIconUrl
    ? chapterIconUrl.startsWith("http")
      ? chapterIconUrl
      : staticFile(chapterIconUrl)
    : staticFile("chapter-icon.svg");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <ScaleIn>
        <Img
          src={jawsugSrc}
          style={{ width: 240, height: 240, objectFit: "contain" }}
        />
      </ScaleIn>
      <FadeIn delay={20} durationInFrames={20}>
        <Img
          src={chapterSrc}
          style={{
            width: 120,
            height: 120,
            objectFit: "contain",
            marginTop: 30,
          }}
        />
      </FadeIn>
      <FadeIn delay={35} durationInFrames={20}>
        <div
          style={{
            color: "#ffffff",
            fontSize: 48,
            fontWeight: 700,
            marginTop: 30,
            textAlign: "center",
          }}
        >
          {chapterName}
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};
