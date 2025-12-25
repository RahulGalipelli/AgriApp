import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { colors, typography, spacing, shadows } from "../theme";
import { FeatureCard } from "../components/FeatureCard";
import { Card } from "../components/Card";
import { useI18n } from "../i18n";
import { useAppStore } from "../state/store";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ navigation }: Props) => {
  const { t } = useI18n();
  const { refreshProducts, refreshCart, refreshOrders } = useAppStore();

  // Refresh data when screen is focused (e.g., after login)
  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const token = await AsyncStorage.getItem("accessToken");
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        
        if (token && isLoggedIn === "true") {
          // Refresh all data when screen is focused and user is logged in
          refreshProducts().catch(console.error);
          refreshCart().catch(console.error);
          refreshOrders().catch(console.error);
        }
      };
      
      loadData();
    }, [refreshProducts, refreshCart, refreshOrders])
  );
  const features = [
    {
      icon: "🌱",
      title: t("home.scanPlant"),
      subtitle: t("home.scanPlantSubtitle"),
      onPress: () => navigation.navigate("ScanPlant"),
      gradient: true,
    },
    {
      icon: "🛒",
      title: t("home.shopProducts"),
      subtitle: t("home.shopProductsSubtitle"),
      onPress: () => navigation.navigate("Products"),
    },
    {
      icon: "📦",
      title: t("home.myOrders"),
      subtitle: t("home.myOrdersSubtitle"),
      onPress: () => navigation.navigate("Orders"),
    },
    {
      icon: "💬",
      title: t("home.support"),
      subtitle: t("home.supportSubtitle"),
      onPress: () => navigation.navigate("Support"),
    },
    {
      icon: "👥",
      title: t("home.community"),
      subtitle: t("home.communitySubtitle"),
      onPress: () => navigation.navigate("Community"),
    },
    {
      icon: "⚙️",
      title: t("home.profile"),
      subtitle: t("home.profileSubtitle"),
      onPress: () => navigation.navigate("Profile"),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t("home.welcome")}</Text>
          <Text style={styles.title}>AgriCure</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>{t("home.logout")}</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <Card variant="elevated" style={styles.heroCard}>
        <View style={styles.heroContent}>
          <Text style={styles.heroEmoji}>🌾</Text>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>{t("home.heroTitle")}</Text>
            <Text style={styles.heroSubtitle}>
              {t("home.heroSubtitle")}
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
        <Text style={styles.sectionTitle}>{t("home.quickActions")}</Text>
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
