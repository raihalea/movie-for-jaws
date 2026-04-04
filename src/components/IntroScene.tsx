import React from "react";
import {
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { PopIn, BlurIn, FadeIn } from "./common/animations";
import { SceneWrapper } from "./common/SceneWrapper";
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

  // Radial glow behind the icon - pulses gently
  const glowScale = 1 + 0.05 * Math.sin(frame * 0.08);
  const renderGlow = () => (
    <div
      style={{
        position: "absolute",
        width: 600,
        height: 600,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${theme.accentColor}18 0%, ${theme.accentColor}08 40%, transparent 70%)`,
        transform: `scale(${glowScale})`,
        pointerEvents: "none",
      }}
    />
  );

  const renderScaleIn = () => (
    <>
      <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {renderGlow()}
        <PopIn>{renderJawsugIcon()}</PopIn>
      </div>
      <BlurIn delay={20} durationInFrames={20}>
        {renderChapterIcon()}
      </BlurIn>
      {eventDate && (
        <FadeIn delay={35} durationInFrames={20}>
          <div style={{ color: theme.mutedTextColor, fontSize: 38, marginTop: 16, textAlign: "center" }}>
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
    const chapterTranslateX = interpolate(frame, [15, 35], [-100, 0], clampConfig);
    const chapterOpacity = interpolate(frame, [15, 35], [0, 1], clampConfig);
    return (
      <>
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {renderGlow()}
          <div
            style={{
              transform: `translateX(${jawsTranslateX}px)`,
              opacity: jawsOpacity,
            }}
          >
            {renderJawsugIcon()}
          </div>
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
            <div style={{ color: theme.mutedTextColor, fontSize: 38, textAlign: "center" }}>
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
        <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {renderGlow()}
          <PopIn>{renderJawsugIcon()}</PopIn>
        </div>
        <BlurIn delay={15} durationInFrames={20}>
          {renderChapterIcon()}
        </BlurIn>
        {eventDate && (
          <BlurIn delay={30} durationInFrames={20}>
            <div style={{ color: theme.mutedTextColor, fontSize: 38, marginTop: 16, textAlign: "center" }}>
              {eventDate}
            </div>
          </BlurIn>
        )}
      </>
    );
  };

  return (
    <SceneWrapper
      theme={theme}
      background={theme.backgroundColor}
      backgroundIntensity={0.5}
    >
      {effect === "scaleIn" && renderScaleIn()}
      {effect === "fadeSlide" && renderFadeSlide()}
      {effect === "typewriter" && renderTypewriter()}
    </SceneWrapper>
  );
};
