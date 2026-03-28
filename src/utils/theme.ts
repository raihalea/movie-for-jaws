import type { ColorTheme } from "../types";

export const DEFAULT_THEME: ColorTheme = {
  backgroundColor: "#1a1a2e",
  accentColor: "#FF9900",
  textColor: "#ffffff",
  mutedTextColor: "#a0a0b0",
  gradientFrom: "#0f0f23",
  gradientTo: "#16213e",
};

export function resolveTheme(
  globalTheme?: ColorTheme,
  sceneOverride?: Partial<ColorTheme>,
): ColorTheme {
  return { ...DEFAULT_THEME, ...globalTheme, ...sceneOverride };
}
