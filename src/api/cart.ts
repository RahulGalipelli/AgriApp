import { API_BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CartItem {
  product_id: string;
  quantity: number;
  product_name: string;
  product_price: number;
}

export interface Cart {
  cart_id: string;
  items: CartItem[];
  total: number;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await AsyncStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getCart(): Promise<Cart> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required");
      }
      throw new Error(`Failed to fetch cart: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
}

export async function addToCart(productId: string, quantity: number = 1): Promise<Cart> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        product_id: productId,
        quantity,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Product not found");
      }
      throw new Error(`Failed to add to cart: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function updateCartItem(productId: string, quantity: number): Promise<Cart> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}?quantity=${quantity}`, {
      method: "PUT",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to update cart item: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
}

export async function removeFromCart(productId: string): Promise<Cart> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to remove from cart: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}

export async function clearCart(): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to clear cart: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
}

