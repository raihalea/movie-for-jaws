import { loadFont } from "@remotion/google-fonts/NotoSansJP";

export const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  ignoreTooManyRequestsWarning: true,
});
