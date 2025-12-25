import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Platform, StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { colors, typography, spacing, shadows } from "../theme";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = true,
  rightComponent,
  transparent = false,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const canGoBack = navigation.canGoBack();

  // Don't show back button if we can't go back or if explicitly disabled
  const shouldShowBack = showBack && canGoBack;

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={transparent ? "transparent" : colors.background} />
      <View style={[styles.header, transparent && styles.transparent]}>
        <View style={styles.leftSection}>
          {shouldShowBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>
                {Platform.OS === "ios" ? "←" : "←"}
              </Text>
              {Platform.OS === "ios" && (
                <Text style={styles.backText}>Back</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {title && (
          <View style={styles.centerSection}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
        )}

        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 50 : 10,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background,
    ...shadows.small,
    zIndex: 1000,
  },
  transparent: {
    backgroundColor: "transparent",
    ...StyleSheet.absoluteFillObject,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
  },
  backIcon: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: "600",
    marginRight: Platform.OS === "ios" ? spacing.xs : 0,
  },
  backText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
  },
  centerSection: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  rightSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

