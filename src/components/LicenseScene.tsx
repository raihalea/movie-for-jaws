import React from "react";
import { AbsoluteFill } from "remotion";
import { FadeIn } from "./common/animations";
import { loadFont } from "@remotion/google-fonts/NotoSansJP";
import type { MusicLicense } from "../types";

const { fontFamily } = loadFont();

interface LicenseSceneProps {
  musicLicense: MusicLicense;
}

export const LicenseScene: React.FC<LicenseSceneProps> = ({
  musicLicense,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f0f23",
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
              color: "#a0a0b0",
              fontSize: 28,
              marginBottom: 16,
            }}
          >
            Music
          </div>
          <div
            style={{
              color: "#ffffff",
              fontSize: 36,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            {musicLicense.title}
          </div>
          <div
            style={{
              color: "#a0a0b0",
              fontSize: 28,
              marginBottom: 20,
            }}
          >
            by {musicLicense.artist}
          </div>
          {musicLicense.licenseType && (
            <div
              style={{
                color: "#a0a0b0",
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
                color: "#666680",
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
