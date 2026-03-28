import type { ColorTheme } from "../types";

export const DEFAULT_THEME: ColorTheme = {
  backgroundColor: "#2d3561",
  accentColor: "#FF9900",
  textColor: "#ffffff",
  mutedTextColor: "#c8c8d8",
  gradientFrom: "#1e2749",
  gradientTo: "#3a4785",
};

export function resolveTheme(
  globalTheme?: ColorTheme,
  sceneOverride?: Partial<ColorTheme>,
): ColorTheme {
  return { ...DEFAULT_THEME, ...globalTheme, ...sceneOverride };
}
