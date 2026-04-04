import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { ScaleIn, FadeIn } from "./common/animations";
import { fontFamily } from "../utils/font";
import type { ColorTheme, IntroEffect } from "../types";

const JawsUgIcon: React.FC<{ size: number; accentColor: string }> = ({
  size,
  accentColor,
}) => (
  <div
    style={{
      width: size,
      height: size,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        color: accentColor,
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
        color: accentColor,
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
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        color: "#3b82f6",
        fontSize: size * 0.14,
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
  eventDate?: string;
  theme: ColorTheme;
  effect?: IntroEffect;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  jawsugIconUrl,
  chapterIconUrl,
  eventDate,
  theme,
  effect = "scaleIn",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
        style={{ width: 420, height: 420, objectFit: "contain" }}
      />
    ) : (
      <JawsUgIcon size={420} accentColor={theme.accentColor} />
    );

  const renderChapterIcon = () =>
    chapterSrc ? (
      <Img
        src={chapterSrc}
        style={{
          width: 220,
          height: 220,
          objectFit: "contain",
          marginTop: 30,
        }}
      />
    ) : (
      <div style={{ marginTop: 30 }}>
        <ChapterIcon size={220} />
      </div>
    );

  const renderScaleIn = () => (
    <>
      <ScaleIn>{renderJawsugIcon()}</ScaleIn>
      <FadeIn delay={20} durationInFrames={20}>
        {renderChapterIcon()}
      </FadeIn>
      {eventDate && (
        <FadeIn delay={35} durationInFrames={20}>
          <div style={{ color: theme.mutedTextColor, fontSize: 44, marginTop: 16, textAlign: "center" }}>
            {eventDate}
          </div>
        </FadeIn>
      )}
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
              style={{ width: 220, height: 220, objectFit: "contain" }}
            />
          ) : (
            <ChapterIcon size={220} />
          )}
        </div>
        {eventDate && (
          <div style={{ transform: `translateX(${chapterTranslateX}px)`, opacity: chapterOpacity, marginTop: 16 }}>
            <div style={{ color: theme.mutedTextColor, fontSize: 44, textAlign: "center" }}>
              {eventDate}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderElasticDrop = () => {
    const clampConfig = {
      extrapolateLeft: "clamp" as const,
      extrapolateRight: "clamp" as const,
    };
    const jawsProgress = spring({
      fps,
      frame,
      config: { damping: 8, stiffness: 150, mass: 0.5 },
    });
    const jawsTranslateY = interpolate(jawsProgress, [0, 1], [-200, 0]);
    const jawsOpacity = interpolate(frame, [0, 10], [0, 1], clampConfig);

    const chapterProgress = spring({
      fps,
      frame: Math.max(0, frame - 15),
      config: { damping: 8, stiffness: 150, mass: 0.5 },
    });
    const chapterTranslateY = interpolate(chapterProgress, [0, 1], [-200, 0]);
    const chapterOpacity = interpolate(frame, [15, 25], [0, 1], clampConfig);

    const dateProgress = spring({
      fps,
      frame: Math.max(0, frame - 25),
      config: { damping: 8, stiffness: 150, mass: 0.5 },
    });
    const dateTranslateY = interpolate(dateProgress, [0, 1], [-200, 0]);
    const dateOpacity = interpolate(frame, [25, 35], [0, 1], clampConfig);

    return (
      <>
        <div
          style={{
            transform: `translateY(${jawsTranslateY}px)`,
            opacity: jawsOpacity,
          }}
        >
          {renderJawsugIcon()}
        </div>
        <div
          style={{
            transform: `translateY(${chapterTranslateY}px)`,
            opacity: chapterOpacity,
            marginTop: 30,
          }}
        >
          {chapterSrc ? (
            <Img
              src={chapterSrc}
              style={{ width: 220, height: 220, objectFit: "contain" }}
            />
          ) : (
            <ChapterIcon size={220} />
          )}
        </div>
        {eventDate && (
          <div
            style={{
              transform: `translateY(${dateTranslateY}px)`,
              opacity: dateOpacity,
              marginTop: 16,
            }}
          >
            <div style={{ color: theme.mutedTextColor, fontSize: 44, textAlign: "center" }}>
              {eventDate}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderTypewriter = () => {
    return (
      <>
        <ScaleIn>{renderJawsugIcon()}</ScaleIn>
        <ScaleIn delay={15}>
          {renderChapterIcon()}
        </ScaleIn>
        {eventDate && (
          <ScaleIn delay={15}>
            <div style={{ color: theme.mutedTextColor, fontSize: 44, marginTop: 16, textAlign: "center" }}>
              {eventDate}
            </div>
          </ScaleIn>
        )}
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
      {effect === "elasticDrop" && renderElasticDrop()}
    </AbsoluteFill>
  );
};
