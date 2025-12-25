/**
 * AgriCure Theme Colors - Production Level Design System
 * Colors extracted from logo.png and enhanced for modern UI
 */

export const colors = {
  // Primary colors (from logo - green theme for agriculture)
  primary: "#2E7D32", // Main green - primary actions
  primaryDark: "#1B5E20", // Darker green for hover/pressed states
  primaryLight: "#4CAF50", // Lighter green for accents
  primaryGradient: ["#2E7D32", "#4CAF50"], // Gradient for modern buttons

  // Secondary colors
  secondary: "#1565C0", // Blue - secondary actions
  secondaryDark: "#0D47A1", // Darker blue
  secondaryLight: "#42A5F5", // Lighter blue
  secondaryGradient: ["#1565C0", "#42A5F5"], // Gradient for secondary buttons

  // Background colors
  background: "#F5F7FA", // Modern light gray background
  backgroundLight: "#FFFFFF", // Pure white for cards
  surface: "#FFFFFF", // Surface color for cards/containers
  surfaceElevated: "#FFFFFF", // Elevated surfaces

  // Text colors
  textPrimary: "#1A1A1A", // Dark text for headings
  textSecondary: "#4A5568", // Medium dark for body text
  textTertiary: "#718096", // Light gray for hints
  textOnPrimary: "#FFFFFF", // White text on primary background
  textOnSecondary: "#FFFFFF", // White text on secondary background

  // Border and divider colors
  border: "#E2E8F0", // Light gray borders
  divider: "#E2E8F0", // Dividers
  borderLight: "#F1F5F9", // Very light borders

  // Status colors
  error: "#E53E3E", // Modern red for errors
  errorLight: "#FED7D7", // Light red background
  success: "#38A169", // Modern green for success
  successLight: "#C6F6D5", // Light green background
  warning: "#DD6B20", // Orange for warnings
  warningLight: "#FEEBC8", // Light orange background
  info: "#3182CE", // Blue for info
  infoLight: "#BEE3F8", // Light blue background

  // Neutral colors
  gray: {
    50: "#F7FAFC",
    100: "#EDF2F7",
    200: "#E2E8F0",
    300: "#CBD5E0",
    400: "#A0AEC0",
    500: "#718096",
    600: "#4A5568",
    700: "#2D3748",
    800: "#1A202C",
    900: "#171923",
  },

  // Light backgrounds for secondary buttons
  secondaryBackground: "#EDF2F7", // Light gray background
  overlay: "rgba(0, 0, 0, 0.4)", // Overlay for modals
  shadow: "rgba(0, 0, 0, 0.1)", // Shadow color
};

export type Colors = typeof colors;

