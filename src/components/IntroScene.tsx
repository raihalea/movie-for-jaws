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

const JawsUgIcon: React.FC<{ size: number; accentColor: string }> = ({
  size,
  accentColor,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: accentColor,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        color: "#ffffff",
        fontSize: size * 0.14,
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.2,
      }}
    >
      JAWS
    </div>
    <div
      style={{
        color: "#ffffff",
        fontSize: size * 0.14,
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.2,
      }}
    >
      -UG
    </div>
  </div>
);

const ChapterIcon: React.FC<{ size: number; text?: string }> = ({
  size,
  text = "Chapter",
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: "#3b82f6",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        color: "#ffffff",
        fontSize: size * 0.12,
        fontWeight: "bold",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {text}
    </div>
  </div>
);

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
    : null;

  const chapterSrc = chapterIconUrl
    ? chapterIconUrl.startsWith("http")
      ? chapterIconUrl
      : staticFile(chapterIconUrl)
    : null;

  const renderJawsugIcon = () =>
    jawsugSrc ? (
      <Img
        src={jawsugSrc}
        style={{ width: 300, height: 300, objectFit: "contain" }}
      />
    ) : (
      <JawsUgIcon size={300} accentColor={theme.accentColor} />
    );

  const renderChapterIcon = () =>
    chapterSrc ? (
      <Img
        src={chapterSrc}
        style={{
          width: 150,
          height: 150,
          objectFit: "contain",
          marginTop: 30,
        }}
      />
    ) : (
      <div style={{ marginTop: 30 }}>
        <ChapterIcon size={150} />
      </div>
    );

  const renderScaleIn = () => (
    <>
      <ScaleIn>{renderJawsugIcon()}</ScaleIn>
      <FadeIn delay={20} durationInFrames={20}>
        {renderChapterIcon()}
      </FadeIn>
      <FadeIn delay={35} durationInFrames={20}>
        <div
          style={{
            color: theme.textColor,
            fontSize: 60,
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
          {renderJawsugIcon()}
        </div>
        <div
          style={{
            transform: `translateX(${chapterTranslateX}px)`,
            opacity: chapterOpacity,
            marginTop: 30,
          }}
        >
          {chapterSrc ? (
            <Img
              src={chapterSrc}
              style={{ width: 150, height: 150, objectFit: "contain" }}
            />
          ) : (
            <ChapterIcon size={150} />
          )}
        </div>
        <div
          style={{
            transform: `translateX(${textTranslateX}px)`,
            opacity: textOpacity,
            color: theme.textColor,
            fontSize: 60,
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
        <ScaleIn>{renderJawsugIcon()}</ScaleIn>
        <ScaleIn delay={15}>
          {renderChapterIcon()}
        </ScaleIn>
        <div
          style={{
            color: theme.textColor,
            fontSize: 60,
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
