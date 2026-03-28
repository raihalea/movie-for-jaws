import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { ScaleIn, FadeIn } from "./common/animations";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import type { ColorTheme, IntroEffect } from "../types";

const { fontFamily } = loadFont();

interface IntroSceneProps {
  jawsugIconUrl?: string;
  chapterIconUrl?: string;
  chapterName: string;
  theme: ColorTheme;
  effect?: IntroEffect;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  jawsugIconUrl,
  chapterIconUrl,
  chapterName,
  theme,
  effect = "scaleIn",
}) => {
  const frame = useCurrentFrame();

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

  const renderScaleIn = () => (
    <>
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
            color: theme.textColor,
            fontSize: 48,
            fontWeight: 700,
            marginTop: 30,
            textAlign: "center",
          }}
        >
          {chapterName}
        </div>
      </FadeIn>
    </>
  );

  const renderFadeSlide = () => {
    const clampConfig = {
      extrapolateLeft: "clamp" as const,
      extrapolateRight: "clamp" as const,
    };
    const jawsTranslateX = interpolate(frame, [0, 20], [-100, 0], clampConfig);
    const jawsOpacity = interpolate(frame, [0, 20], [0, 1], clampConfig);
    const chapterTranslateX = interpolate(
      frame,
      [15, 35],
      [-100, 0],
      clampConfig,
    );
    const chapterOpacity = interpolate(frame, [15, 35], [0, 1], clampConfig);
    const textTranslateX = interpolate(
      frame,
      [30, 50],
      [-100, 0],
      clampConfig,
    );
    const textOpacity = interpolate(frame, [30, 50], [0, 1], clampConfig);

    return (
      <>
        <div
          style={{
            transform: `translateX(${jawsTranslateX}px)`,
            opacity: jawsOpacity,
          }}
        >
          <Img
            src={jawsugSrc}
            style={{ width: 240, height: 240, objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            transform: `translateX(${chapterTranslateX}px)`,
            opacity: chapterOpacity,
            marginTop: 30,
          }}
        >
          <Img
            src={chapterSrc}
            style={{ width: 120, height: 120, objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            transform: `translateX(${textTranslateX}px)`,
            opacity: textOpacity,
            color: theme.textColor,
            fontSize: 48,
            fontWeight: 700,
            marginTop: 30,
            textAlign: "center",
          }}
        >
          {chapterName}
        </div>
      </>
    );
  };

  const renderTypewriter = () => {
    const visibleChars = Math.min(
      chapterName.length,
      Math.max(0, Math.floor((frame - 35) / 2)),
    );

    return (
      <>
        <ScaleIn>
          <Img
            src={jawsugSrc}
            style={{ width: 240, height: 240, objectFit: "contain" }}
          />
        </ScaleIn>
        <ScaleIn delay={15}>
          <Img
            src={chapterSrc}
            style={{
              width: 120,
              height: 120,
              objectFit: "contain",
              marginTop: 30,
            }}
          />
        </ScaleIn>
        <div
          style={{
            color: theme.textColor,
            fontSize: 48,
            fontWeight: 700,
            marginTop: 30,
            textAlign: "center",
          }}
        >
          {chapterName.slice(0, visibleChars)}
        </div>
      </>
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.backgroundColor,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      {effect === "scaleIn" && renderScaleIn()}
      {effect === "fadeSlide" && renderFadeSlide()}
      {effect === "typewriter" && renderTypewriter()}
    </AbsoluteFill>
  );
};
