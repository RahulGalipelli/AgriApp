/**
 * Typography styles for AgriCure
 */

export const typography = {
  // Headings
  h1: {
    fontSize: 28,
    fontWeight: "800" as const,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: "800" as const,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: "700" as const,
    lineHeight: 24,
  },

  // Body text
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 22,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },

  // Button text
  button: {
    fontSize: 16,
    fontWeight: "800" as const,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: "800" as const,
  },
};

export type Typography = typeof typography;

