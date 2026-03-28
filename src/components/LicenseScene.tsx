import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FadeIn, SlideUp } from "./common/animations";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import type { MusicLicense, ColorTheme, LicenseEffect } from "../types";

const { fontFamily } = loadFont();

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

  // typewriter: characters appear progressively
  const titleChars = Math.min(musicLicense.title.length, Math.max(0, Math.floor((frame - 20) / 2)));
  const artistChars = Math.min(artistText.length, Math.max(0, Math.floor((frame - 40) / 2)));

  const renderContent = () => {
    if (effect === 'typewriter') {
      return (
        <div style={{ textAlign: "center" }}>
          <FadeIn durationInFrames={15}>
            <div
              style={{
                fontSize: 64,
                marginBottom: 30,
              }}
            >
              ♪
            </div>
            <div
              style={{
                color: theme.mutedTextColor,
                fontSize: 28,
                marginBottom: 16,
              }}
            >
              Music
            </div>
          </FadeIn>
          <div
            style={{
              color: theme.textColor,
              fontSize: 36,
              fontWeight: 700,
              marginBottom: 12,
              minHeight: 44,
            }}
          >
            {musicLicense.title.slice(0, titleChars)}
          </div>
          <div
            style={{
              color: theme.mutedTextColor,
              fontSize: 28,
              marginBottom: 20,
              minHeight: 34,
            }}
          >
            {artistText.slice(0, artistChars)}
          </div>
          {musicLicense.licenseType && (
            <FadeIn durationInFrames={15} delay={60}>
              <div
                style={{
                  color: theme.mutedTextColor,
                  fontSize: 22,
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
                  fontSize: 20,
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
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 64,
            marginBottom: 30,
          }}
        >
          ♪
        </div>
        <div
          style={{
            color: theme.mutedTextColor,
            fontSize: 28,
            marginBottom: 16,
          }}
        >
          Music
        </div>
        <div
          style={{
            color: theme.textColor,
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          {musicLicense.title}
        </div>
        <div
          style={{
            color: theme.mutedTextColor,
            fontSize: 28,
            marginBottom: 20,
          }}
        >
          {artistText}
        </div>
        {musicLicense.licenseType && (
          <div
            style={{
              color: theme.mutedTextColor,
              fontSize: 22,
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
              fontSize: 20,
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
    <AbsoluteFill
      style={{
        backgroundColor: theme.gradientFrom,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      {renderContent()}
    </AbsoluteFill>
  );
};
