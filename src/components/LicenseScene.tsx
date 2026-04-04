import React from "react";
import { useCurrentFrame } from "remotion";
import { FadeIn, SlideUp } from "./common/animations";
import { AnimatedDivider } from "./common/DecorativeElements";
import { AutoSizeText } from "./common/AutoSizeText";
import { SceneWrapper } from "./common/SceneWrapper";
import type { MusicLicense, ColorTheme, LicenseEffect } from "../types";

interface LicenseSceneProps {
  musicLicense: MusicLicense;
  theme: ColorTheme;
  effect?: LicenseEffect;
}

export const LicenseScene: React.FC<LicenseSceneProps> = ({
  musicLicense,
  theme,
  effect = 'fadeIn',
}) => {
  const frame = useCurrentFrame();

  const artistText = `by ${musicLicense.artist}`;

  // Swaying music note
  const noteRotate = 5 * Math.sin(frame * 0.08);

  // typewriter: characters appear progressively
  const titleChars = Math.min(musicLicense.title.length, Math.max(0, Math.floor((frame - 20) / 2)));
  const artistChars = Math.min(artistText.length, Math.max(0, Math.floor((frame - 40) / 2)));

  const renderContent = () => {
    if (effect === 'typewriter') {
      return (
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <FadeIn durationInFrames={15}>
            <div
              style={{
                fontSize: 94,
                marginBottom: 24,
                transform: `rotate(${noteRotate}deg)`,
              }}
            >
              ♪
            </div>
            <div
              style={{
                color: theme.mutedTextColor,
                fontSize: 34,
                marginBottom: 16,
              }}
            >
              Music
            </div>
          </FadeIn>
          <AnimatedDivider width={600} color={theme.accentColor} delay={15} thickness={2} />
          <div
            style={{
              color: theme.textColor,
              fontSize: 54,
              fontWeight: 700,
              marginTop: 16,
              marginBottom: 12,
              minHeight: 76,
            }}
          >
            {musicLicense.title.slice(0, titleChars)}
          </div>
          <div
            style={{
              color: theme.mutedTextColor,
              fontSize: 42,
              marginBottom: 20,
              minHeight: 62,
            }}
          >
            {artistText.slice(0, artistChars)}
          </div>
          <AnimatedDivider width={600} color={theme.accentColor} delay={55} thickness={2} />
          {musicLicense.licenseType && (
            <FadeIn durationInFrames={15} delay={60}>
              <div
                style={{
                  color: theme.mutedTextColor,
                  fontSize: 34,
                  marginTop: 12,
                  marginBottom: 8,
                }}
              >
                {musicLicense.licenseType}
              </div>
            </FadeIn>
          )}
          {musicLicense.url && (
            <FadeIn durationInFrames={15} delay={70}>
              <div
                style={{
                  color: theme.mutedTextColor,
                  fontSize: 32,
                }}
              >
                {musicLicense.url}
              </div>
            </FadeIn>
          )}
        </div>
      );
    }

    const content = (
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div
          style={{
            fontSize: 94,
            marginBottom: 24,
            transform: `rotate(${noteRotate}deg)`,
          }}
        >
          ♪
        </div>
        <div
          style={{
            color: theme.mutedTextColor,
            fontSize: 34,
            marginBottom: 16,
          }}
        >
          Music
        </div>
        <AnimatedDivider width={600} color={theme.accentColor} delay={5} thickness={2} />
        <div style={{ marginTop: 16 }}>
          <AutoSizeText
            text={musicLicense.title}
            maxFontSize={54}
            minFontSize={32}
            maxWidth={1200}
            fontWeight={700}
            style={{ color: theme.textColor }}
          />
        </div>
        <div
          style={{
            color: theme.mutedTextColor,
            fontSize: 42,
            marginBottom: 20,
          }}
        >
          {artistText}
        </div>
        <AnimatedDivider width={600} color={theme.accentColor} delay={10} thickness={2} />
        {musicLicense.licenseType && (
          <div
            style={{
              color: theme.mutedTextColor,
              fontSize: 34,
              marginTop: 12,
              marginBottom: 8,
            }}
          >
            {musicLicense.licenseType}
          </div>
        )}
        {musicLicense.url && (
          <div
            style={{
              color: theme.mutedTextColor,
              fontSize: 32,
            }}
          >
            {musicLicense.url}
          </div>
        )}
      </div>
    );

    if (effect === 'slideUp') {
      return <SlideUp durationInFrames={25}>{content}</SlideUp>;
    }

    // fadeIn (default)
    return <FadeIn durationInFrames={25}>{content}</FadeIn>;
  };

  return (
    <SceneWrapper
      theme={theme}
      background={theme.gradientFrom}
      backgroundIntensity={0.3}
      showCornerAccents={false}
    >
      {renderContent()}
    </SceneWrapper>
  );
};
