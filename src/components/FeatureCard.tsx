import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "./Card";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";
import { spacing } from "../theme/spacing";

interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  gradient?: boolean;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  gradient = false,
}) => {
  return (
    <Card
      variant="elevated"
      onPress={onPress}
      style={[styles.featureCard, gradient && styles.gradientCard]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>→</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    padding: spacing.lg,
    minHeight: 80,
  },
  gradientCard: {
    backgroundColor: colors.primaryLight + "10",
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  arrowContainer: {
    marginLeft: spacing.sm,
  },
  arrow: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: "300",
  },
});

