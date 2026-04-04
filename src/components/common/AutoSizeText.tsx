import React from "react";
import { fitTextOnNLines } from "@remotion/layout-utils";
import { fontFamily } from "../../utils/font";

interface AutoSizeTextProps {
  text: string;
  maxFontSize: number;
  minFontSize: number;
  maxWidth: number;
  maxLines?: number;
  fontWeight?: number;
  style?: React.CSSProperties;
}

export const AutoSizeText: React.FC<AutoSizeTextProps> = ({
  text,
  maxFontSize,
  minFontSize,
  maxWidth,
  maxLines = 2,
  fontWeight = 700,
  style,
}) => {
  const { fontSize } = fitTextOnNLines({
    text,
    maxLines,
    maxBoxWidth: maxWidth,
    maxFontSize,
    fontFamily,
    fontWeight: String(fontWeight),
  });

  const clampedSize = Math.max(minFontSize, fontSize);

  return (
    <div
      style={{
        fontSize: clampedSize,
        fontWeight,
        fontFamily,
        textAlign: "center",
        lineHeight: 1.3,
        maxWidth: maxWidth + 40,
        whiteSpace: "pre-line",
        wordBreak: "break-word" as const,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
