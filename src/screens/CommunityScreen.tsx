import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList } from "react-native";
import { colors, typography, spacing, shadows } from "../theme";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

type ContentType = "videos" | "articles" | "forum";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
}

const SAMPLE_CONTENT: ContentItem[] = [
  {
    id: "1",
    title: "Organic Pest Control Methods",
    description: "Learn natural ways to protect your crops from pests",
    type: "videos",
  },
  {
    id: "2",
    title: "Seasonal Crop Planning Guide",
    description: "Best practices for planning your crops throughout the year",
    type: "articles",
  },
  {
    id: "3",
    title: "Water Management Tips",
    description: "Efficient irrigation techniques for better yields",
    type: "articles",
  },
  {
    id: "4",
    title: "Farmer Discussion: Soil Health",
    description: "Join the conversation about improving soil quality",
    type: "forum",
  },
];

export default function CommunityScreen() {
  const [selectedTab, setSelectedTab] = useState<ContentType>("videos");
  const filteredContent = SAMPLE_CONTENT.filter(item => item.type === selectedTab);

  return (
    <View style={styles.container}>
      <Header title="Community" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="elevated" style={styles.heroCard}>
          <Text style={styles.heroEmoji}>👥</Text>
          <Text style={styles.heroTitle}>Farmer Community</Text>
          <Text style={styles.heroSubtitle}>
            Learn, share, and grow together with fellow farmers
          </Text>
        </Card>

        <View style={styles.tabs}>
          {(["videos", "articles", "forum"] as ContentType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.tabActive,
              ]}
              onPress={() => setSelectedTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.tabTextActive,
                ]}
              >
                {tab === "videos" ? "📹 Videos" :
                 tab === "articles" ? "📚 Articles" :
                 "💬 Forum"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredContent.length === 0 ? (
          <Card variant="outlined" style={styles.emptyCard}>
            <Text style={styles.emptyText}>No {selectedTab} available yet</Text>
          </Card>
        ) : (
          <FlatList
            data={filteredContent}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card variant="elevated" style={styles.contentCard}>
                <Text style={styles.contentTitle}>{item.title}</Text>
                <Text style={styles.contentDescription}>{item.description}</Text>
                <Button
                  title="View"
                  onPress={() => {
                    // Navigate to content detail or open video/article
                  }}
                  size="small"
                  variant="outline"
                  style={styles.viewButton}
                />
              </Card>
            )}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
  },
  heroCard: {
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: "center",
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundLight,
    alignItems: "center",
  },
  tabActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  tabText: {
    ...typography.buttonSmall,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  contentCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  contentTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  contentDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  viewButton: {
    alignSelf: "flex-start",
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

