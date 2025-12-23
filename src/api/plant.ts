import * as FileSystem from "expo-file-system";
import { API_BASE_URL } from "../config";
import type { PlantAnalysisResult } from "../types/plant";

function tryParseJsonObject(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const startsWithJson = trimmed.startsWith("{") || trimmed.startsWith("[");
  if (startsWithJson) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  const openBrace = trimmed.indexOf("{");
  const closeBrace = trimmed.lastIndexOf("}");
  if (openBrace !== -1 && closeBrace !== -1 && closeBrace > openBrace) {
    const candidate = trimmed.slice(openBrace, closeBrace + 1);
    try {
      const parsed = JSON.parse(candidate) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  return null;
}

function normalizePlantAnalysis(raw: unknown): PlantAnalysisResult {
  if (!raw) return {};

  if (typeof raw === "string") {
    const parsed = (tryParseJsonObject(raw) ?? {}) as PlantAnalysisResult;
    return normalizePlantAnalysis(parsed);
  }

  if (typeof raw !== "object") return {};

  const obj = raw as Record<string, unknown>;

  if (typeof obj.result === "object" && obj.result && !Array.isArray(obj.result)) {
    return normalizePlantAnalysis(obj.result);
  }

  if (typeof obj.analysis === "object" && obj.analysis && !Array.isArray(obj.analysis)) {
    return normalizePlantAnalysis(obj.analysis);
  }

  const output = obj.output;
  if (Array.isArray(output)) {
    const first = output[0] as any;
    const content = first?.content;
    if (Array.isArray(content)) {
      const firstContent = content[0] as any;
      const text = firstContent?.text;
      if (typeof text === "string") {
        return normalizePlantAnalysis(tryParseJsonObject(text) ?? {});
      }
    }
  }

  if (typeof obj.text === "string") {
    const parsed = tryParseJsonObject(obj.text);
    return normalizePlantAnalysis(parsed ?? obj);
  }

  const normalized = obj as PlantAnalysisResult;
  if (
    typeof normalized.disease_name === "string" &&
    normalized.disease_name.trim().length > 0 &&
    !Array.isArray(normalized.detections)
  ) {
    return {
      ...normalized,
      detections: [
        {
          label: normalized.disease_name,
          kind: "disease",
          confidence: typeof normalized.confidence === "number" ? normalized.confidence : undefined
        }
      ]
    };
  }
  return normalized;
}

export async function analyzePlantImage(imageUri: string): Promise<PlantAnalysisResult> {
  let fileUri = imageUri;

  if (imageUri.startsWith("ph://")) {
    const dest = `${FileSystem.Paths.cache.uri}plant.jpg`;
    await FileSystem.copyAsync({ from: imageUri, to: dest });
    fileUri = dest;
  }

  const formData = new FormData();
  formData.append(
    "file",
    {
      uri: fileUri,
      name: "plant.jpg",
      type: "image/jpeg"
    } as any
  );

  const response = await fetch(`${API_BASE_URL}/plant/analyze`, {
    method: "POST",
    body: formData
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Plant analyze request failed");
  }

  const data = (await response.json()) as unknown;
  return normalizePlantAnalysis(data);
}
