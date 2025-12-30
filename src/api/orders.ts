import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
}

export interface Order {
  id: string;
  status: string;
  total_amount: number;
  address: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await AsyncStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getOrders(): Promise<Order[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }
      const statusText = response.statusText || `HTTP ${response.status}`;
      throw new Error(`Failed to fetch orders: ${statusText}`);
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
      console.error("Error fetching orders:", error);
    }
    throw error;
  }
}

export async function getOrder(orderId: string): Promise<Order> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Order not found");
      }
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Only log unexpected errors
    if (!(error instanceof Error && (error.message.includes("Authentication") || error.message.includes("not found")))) {
      console.error("Error fetching order:", error);
    }
    throw error;
  }
}

export async function createOrder(address: string): Promise<Order> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify({ address }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const error = await response.json();
        throw new Error(error.detail || "Cart is empty");
      }
      throw new Error(`Failed to create order: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    // Only log unexpected errors
    if (!(error instanceof Error && (error.message.includes("Authentication") || error.message.includes("empty")))) {
      console.error("Error creating order:", error);
    }
    throw error;
  }
}

