import type { FoundationColorSample } from "./foundations-colors-section.types";

export const FOUNDATION_COLOR_SAMPLES = [
  { label: "Amarelo", tone: "yellow" },
  { label: "Laranja", tone: "orange" },
  { label: "Vermelho", tone: "red" },
  { label: "Rosa", tone: "pink" },
  { label: "Roxo", tone: "purple" },
  { label: "Azul", tone: "blue" },
  { label: "Ciano", tone: "cyan" },
  { label: "Verde", tone: "green" },
] as const satisfies readonly FoundationColorSample[];
