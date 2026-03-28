import React from "react";
import { AbsoluteFill } from "remotion";
import { FadeIn } from "./common/animations";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import type { MusicLicense, ColorTheme } from "../types";

const { fontFamily } = loadFont();

interface LicenseSceneProps {
  musicLicense: MusicLicense;
  theme: ColorTheme;
}

export const LicenseScene: React.FC<LicenseSceneProps> = ({
  musicLicense,
  theme,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.gradientFrom,
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <FadeIn durationInFrames={25}>
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
            by {musicLicense.artist}
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
      </FadeIn>
    </AbsoluteFill>
  );
};
