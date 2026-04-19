import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_active: boolean;
  images: string[];
  stock_quantity: number;
  unit?: string | null;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await AsyncStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }
      // Don't throw detailed errors for server errors (5xx) - they'll be handled silently
      if (response.status >= 500) {
        throw new Error(`Server error: HTTP ${response.status}`);
      }
      const statusText = response.statusText || `HTTP ${response.status}`;
      throw new Error(`Failed to fetch products: ${statusText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Handle network errors silently (likely connectivity issues)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Network error: Unable to connect to server");
    }
    // Only log unexpected errors (not auth or network errors)
    if (!(error instanceof Error && (
      error.message.includes("Authentication") || 
      error.message.includes("Network error")
    ))) {
      console.error("Error fetching products:", error);
    }
    throw error;
  }
}

export async function getProduct(productId: string): Promise<Product> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Product not found");
      }
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Only log unexpected errors
    if (!(error instanceof Error && error.message.includes("Authentication"))) {
      console.error("Error fetching product:", error);
    }
    throw error;
  }
}

