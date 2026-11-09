import type { CSSProperties } from "react";

// Printed packet colours. Each pairs a field colour with the text colour that reads on it (see globals.css).
export type Variety = "tomato" | "squash" | "pea" | "berry" | "beet" | "sky" | "pumpkin";

export const variety = (v: Variety) =>
  ({ "--pk": `var(--c-${v})`, "--pk-fg": `var(--c-${v}-fg)` }) as CSSProperties;

// One variety per meal, one per day of the week
export const mealVariety: Record<string, Variety> = {
  breakfast: "squash",
  lunch: "pea",
  snacks: "sky",
  snack: "sky",
  dinner: "beet",
};

export const dayVarieties: Variety[] = ["tomato", "squash", "pea", "berry", "beet", "sky", "pumpkin"];
