import type { ColorTheme } from "../types";

export const DEFAULT_THEME: ColorTheme = {
  backgroundColor: "#c8daf0",
  accentColor: "#FF9900",
  textColor: "#1a2030",
  mutedTextColor: "#5a6880",
  gradientFrom: "#a8c4e0",
  gradientTo: "#d8e6f5",
};

export function resolveTheme(
  globalTheme?: ColorTheme,
  sceneOverride?: Partial<ColorTheme>,
): ColorTheme {
  return { ...DEFAULT_THEME, ...globalTheme, ...sceneOverride };
}
