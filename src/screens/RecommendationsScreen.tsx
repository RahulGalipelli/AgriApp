import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, FlatList, ScrollView, TouchableOpacity, Linking, Alert } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigations/types";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore } from "../state/store";
import { colors, typography, spacing } from "../theme";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Card } from "../components/Card";

type Props = NativeStackScreenProps<RootStackParamList, "Recommendations">;

function toSteps(result: Record<string, unknown>): string[] {
  const nextSteps = result.next_steps;
  if (Array.isArray(nextSteps)) {
    const cleaned = nextSteps.filter((s): s is string => typeof s === "string").map((s) => s.trim()).filter(Boolean);
    if (cleaned.length > 0) return cleaned;
  }
  const fallback: string[] = [];
  const symptoms = typeof result.symptoms === "string" ? result.symptoms.trim() : "";
  const prevention = typeof result.prevention === "string" ? result.prevention.trim() : "";
  const organic = typeof result.organic_treatment === "string" ? result.organic_treatment.trim() : "";
  if (symptoms) fallback.push(symptoms);
  if (organic) fallback.push(organic);
  if (prevention) fallback.push(prevention);
  return fallback.length > 0 ? fallback : ["No recommendations available."];
}

export default function RecommendationsScreen({ navigation, route }: Props) {
  const { result } = route.params;
  const resultObj = result as unknown as Record<string, unknown>;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const issue = typeof resultObj.disease_name === "string" ? (resultObj.disease_name as string) : "Issue";
  const organic =
    typeof resultObj.organic_treatment === "string" ? (resultObj.organic_treatment as string) : undefined;
  const chemical =
    typeof resultObj.chemical_treatment === "string" ? (resultObj.chemical_treatment as string) : undefined;
  const prevention = typeof resultObj.prevention === "string" ? (resultObj.prevention as string) : undefined;
  const steps = toSteps(resultObj);
  const { products, addToCart, cartItemCount } = useAppStore();
  const recommended = products.length > 0 
    ? [...products].sort((a, b) => a.price - b.price).slice(0, 3)
    : [];

  useEffect(() => {
    AsyncStorage.getItem("audioEnabled").then(val => {
      setAudioEnabled(val !== "false");
    });
    return () => {
      if (sound) {
        sound.unloadAsync().catch(console.error);
      }
    };
  }, []);

  const audioText = React.useMemo(() => {
    const parts: string[] = [];
    parts.push(`Treatment recommendations for ${issue}`);
    steps.forEach((step, idx) => {
      parts.push(`Step ${idx + 1}: ${step}`);
    });
    if (organic) parts.push(`Organic treatment: ${organic}`);
    if (chemical) parts.push(`Chemical treatment: ${chemical}`);
    if (prevention) parts.push(`Prevention: ${prevention}`);
    return parts.join(". ");
  }, [issue, steps, organic, chemical, prevention]);

  const playAudio = async () => {
    if (!audioEnabled || !audioText) return;
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        require("../assets/audio/welcome-en.mp3") // Placeholder - should be generated TTS
      );
      setSound(newSound);
      setIsPlaying(true);
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          newSound.unloadAsync().catch(console.error);
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const shareViaWhatsApp = () => {
    const message = `🌾 Plant Disease Treatment Recommendations\n\n` +
      `Issue: ${issue}\n\n` +
      `Steps:\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n` +
      (organic ? `Organic Treatment: ${organic}\n\n` : "") +
      (chemical ? `Chemical Treatment: ${chemical}\n\n` : "") +
      (prevention ? `Prevention: ${prevention}\n\n` : "") +
      `Recommended Products:\n${recommended.map(p => `- ${p.name} (₹${p.price})`).join("\n")}`;
    
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "WhatsApp is not installed on this device");
      }
    }).catch(err => {
      console.error("Error opening WhatsApp:", err);
      Alert.alert("Error", "Could not open WhatsApp");
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Recommendations" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.subtitle}>{issue}</Text>
          {audioEnabled && audioText && (
            <TouchableOpacity
              onPress={isPlaying ? stopAudio : playAudio}
              style={styles.audioButton}
              activeOpacity={0.7}
            >
              <Text style={styles.audioButtonText}>
                {isPlaying ? "⏸ Stop Audio" : "▶ Play Audio"}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={shareViaWhatsApp}
            style={styles.shareButton}
            activeOpacity={0.7}
          >
            <Text style={styles.shareButtonText}>📱 Share via WhatsApp</Text>
          </TouchableOpacity>
        </View>

      <FlatList
        data={steps}
        keyExtractor={(item, idx) => `${idx}-${item}`}
        renderItem={({ item }) => <Text style={styles.bullet}>• {item}</Text>}
        contentContainerStyle={styles.list}
        ListFooterComponent={
          <View style={styles.footer}>
            {organic ? (
              <>
                <Text style={styles.sectionTitle}>Organic treatment</Text>
                <Text style={styles.paragraph}>{organic}</Text>
              </>
            ) : null}
            {chemical ? (
              <>
                <Text style={styles.sectionTitle}>Chemical treatment</Text>
                <Text style={styles.paragraph}>{chemical}</Text>
              </>
            ) : null}
            {prevention ? (
              <>
                <Text style={styles.sectionTitle}>Prevention</Text>
                <Text style={styles.paragraph}>{prevention}</Text>
              </>
            ) : null}

            <Text style={styles.sectionTitle}>Recommended products</Text>
            {recommended.length === 0 ? (
              <Card variant="outlined" style={styles.emptyProductCard}>
                <Text style={styles.emptyProductText}>No products available at the moment</Text>
              </Card>
            ) : (
              recommended.map((p) => (
                <View key={p.id} style={styles.productRow}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{p.name}</Text>
                    <Text style={styles.productMeta}>
                      ₹{p.price}
                      {p.unit ? ` • ${p.unit}` : ""}
                    </Text>
                  </View>
                  <Button
                    title="Add"
                    onPress={() => addToCart(p.id, 1).catch(console.error)}
                    size="small"
                    style={styles.addButton}
                  />
                </View>
              ))
            )}

            <Button
              title="Browse Products"
              onPress={() => navigation.navigate("Products")}
              fullWidth
              style={styles.button}
            />
            <Button
              title={`Go to Cart (${cartItemCount})`}
              onPress={() => navigation.navigate("Cart")}
              variant="outline"
              style={styles.cartButton}
            />
          </View>
        }
      />
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
  header: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  subtitle: { 
    ...typography.h3, 
    color: colors.textPrimary, 
    textAlign: "center" 
  },
  list: { 
    paddingTop: spacing.lg, 
    paddingBottom: spacing.xl 
  },
  bullet: { 
    ...typography.body, 
    color: colors.textSecondary, 
    marginBottom: spacing.sm 
  },
  button: { 
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  footer: { 
    marginTop: spacing.lg 
  },
  sectionTitle: { 
    ...typography.h3, 
    marginBottom: spacing.sm, 
    color: colors.textPrimary 
  },
  paragraph: { 
    marginBottom: spacing.md, 
    color: colors.textSecondary, 
    lineHeight: 20 
  },
  productRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.md,
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm
  },
  productInfo: { 
    flex: 1, 
    paddingRight: spacing.sm 
  },
  productName: { 
    ...typography.button, 
    color: colors.textPrimary 
  },
  productMeta: { 
    marginTop: spacing.xs, 
    color: colors.textSecondary 
  },
  addButton: { 
    minWidth: 80,
  },
  cartButton: { 
    marginTop: spacing.sm,
  },
  emptyProductCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyProductText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  audioButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    backgroundColor: colors.primary,
    alignSelf: "center",
  },
  audioButtonText: {
    ...typography.buttonSmall,
    color: colors.textOnPrimary,
  },
  shareButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.sm,
    backgroundColor: colors.success,
    alignSelf: "center",
  },
  shareButtonText: {
    ...typography.buttonSmall,
    color: colors.textOnPrimary,
  },
});
