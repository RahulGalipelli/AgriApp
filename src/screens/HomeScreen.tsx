import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { colors, typography, spacing, shadows } from "../theme";
import { FeatureCard } from "../components/FeatureCard";
import { Card } from "../components/Card";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: Props) => {
  const features = [
    {
      icon: "🌱",
      title: "Scan Plant",
      subtitle: "Upload photo to detect diseases",
      onPress: () => navigation.navigate("ScanPlant"),
      gradient: true,
    },
    {
      icon: "🛒",
      title: "Shop Products",
      subtitle: "Browse treatment products",
      onPress: () => navigation.navigate("Products"),
    },
    {
      icon: "📦",
      title: "My Orders",
      subtitle: "Track your orders",
      onPress: () => navigation.navigate("Orders"),
    },
    {
      icon: "💬",
      title: "Support",
      subtitle: "Call or video chat with experts",
      onPress: () => navigation.navigate("Support"),
    },
    {
      icon: "👥",
      title: "Community",
      subtitle: "Tips and discussions",
      onPress: () => navigation.navigate("Community"),
    },
    {
      icon: "⚙️",
      title: "Profile",
      subtitle: "Settings and preferences",
      onPress: () => navigation.navigate("Profile"),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.title}>AgriCure</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <Card variant="elevated" style={styles.heroCard}>
        <View style={styles.heroContent}>
          <Text style={styles.heroEmoji}>🌾</Text>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Plant Health Detection</Text>
            <Text style={styles.heroSubtitle}>
              Get instant diagnosis and treatment recommendations
            </Text>
          </View>
        </View>
      </Card>

      {/* Features Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={<Text style={styles.iconEmoji}>{feature.icon}</Text>}
            title={feature.title}
            subtitle={feature.subtitle}
            onPress={feature.onPress}
            gradient={feature.gradient}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 60,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: "900",
  },
  logoutButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.secondaryBackground,
  },
  logoutText: {
    ...typography.buttonSmall,
    color: colors.secondary,
  },
  heroCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    padding: spacing.xl,
    backgroundColor: colors.primary,
    ...shadows.large,
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroEmoji: {
    fontSize: 48,
    marginRight: spacing.md,
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textOnPrimary,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  iconEmoji: {
    fontSize: 24,
  },
});
