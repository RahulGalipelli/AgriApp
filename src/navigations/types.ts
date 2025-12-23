import type { PlantAnalysisResult } from "../types/plant";

export type RootStackParamList = {
  Splash: undefined;
  Language: undefined;
  Login: undefined;
  Home: undefined;
  ScanPlant: undefined;
  Processing: { imageUri: string };
  DetectionResult: { imageUri: string; result: PlantAnalysisResult };
  Recommendations: { result: PlantAnalysisResult };
  Products: undefined;
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };
  Orders: undefined;
  Tracking: { orderId: string };
  Support: undefined;
  Community: undefined;
  Profile: undefined;
};

