export type FoundationColorTone =
  "yellow" | "orange" | "red" | "pink" | "purple" | "blue" | "cyan" | "green";

export type FoundationColorSample = Readonly<{
  label: string;
  tone: FoundationColorTone;
}>;
