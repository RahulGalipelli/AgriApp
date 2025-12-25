import React from "react";
import { View, StyleSheet, ViewStyle, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { colors } from "../theme/colors";
import { shadows } from "../theme/shadows";
import { spacing } from "../theme/spacing";

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "elevated" | "outlined";
  padding?: keyof typeof spacing;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = "default",
  padding = "md",
  onPress,
  ...props
}) => {
  const cardStyle = [
    styles.card,
    variant === "elevated" && styles.elevated,
    variant === "outlined" && styles.outlined,
    { padding: spacing[padding] },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: "hidden",
  },
  elevated: {
    ...shadows.medium,
    backgroundColor: colors.surfaceElevated,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});

