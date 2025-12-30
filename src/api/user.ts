import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await AsyncStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface UpdateUserRequest {
  language?: string;
  name?: string;
}

export async function updateUser(data: UpdateUserRequest): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to update user: ${response.statusText}`);
    }
  } catch (error) {
    // Only log unexpected errors (not auth errors)
    if (!(error instanceof Error && error.message.includes("Authentication"))) {
      console.error("Error updating user:", error);
    }
    throw error;
  }
}

