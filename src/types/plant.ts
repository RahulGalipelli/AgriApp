export type PlantAnalysisResult = {
  crop_type?: string;
  disease_name?: string;
  confidence?: number;
  symptoms?: string;
  organic_treatment?: string;
  chemical_treatment?: string;
  prevention?: string;
  next_steps?: string[];
  detections?: Array<{
    label: string;
    kind?: "disease" | "deficiency" | "pest" | "other";
    confidence?: number;
  }>;
  [key: string]: unknown;
};
