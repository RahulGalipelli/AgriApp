import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CartLine, Order, OrderStatus, Product } from "./types";
import * as productsAPI from "../api/products";
import * as cartAPI from "../api/cart";
import * as ordersAPI from "../api/orders";

type AppState = {
  products: Product[];
  cart: CartLine[];
  orders: Order[];
  loading: {
    products: boolean;
    cart: boolean;
    orders: boolean;
  };
  error: {
    products: string | null;
    cart: string | null;
    orders: string | null;
  };
};

type AppActions = {
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  setCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  placeOrder: (args: { address: string }) => Promise<string>;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  getProductById: (productId: string) => Product | undefined;
  getOrderById: (orderId: string) => Order | undefined;
  refreshProducts: () => Promise<void>;
  refreshCart: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  cartItemCount: number;
  cartTotal: number;
};

type AppStoreValue = AppState & AppActions;

const STORAGE_ORDERS_KEY = "appState_v1_orders";

type Action =
  | { type: "SET_PRODUCTS_LOADING"; loading: boolean }
  | { type: "SET_PRODUCTS"; products: Product[] }
  | { type: "SET_PRODUCTS_ERROR"; error: string | null }
  | { type: "SET_CART_LOADING"; loading: boolean }
  | { type: "SET_CART"; cart: CartLine[] }
  | { type: "SET_CART_ERROR"; error: string | null }
  | { type: "SET_ORDERS_LOADING"; loading: boolean }
  | { type: "SET_ORDERS"; orders: Order[] }
  | { type: "SET_ORDERS_ERROR"; error: string | null }
  | { type: "ADD_ORDER"; order: Order }
  | { type: "SET_ORDER_STATUS"; orderId: string; status: OrderStatus };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_PRODUCTS_LOADING":
      return { ...state, loading: { ...state.loading, products: action.loading } };
    case "SET_PRODUCTS":
      return { ...state, products: action.products, loading: { ...state.loading, products: false }, error: { ...state.error, products: null } };
    case "SET_PRODUCTS_ERROR":
      return { ...state, loading: { ...state.loading, products: false }, error: { ...state.error, products: action.error } };
    case "SET_CART_LOADING":
      return { ...state, loading: { ...state.loading, cart: action.loading } };
    case "SET_CART":
      return { ...state, cart: action.cart, loading: { ...state.loading, cart: false }, error: { ...state.error, cart: null } };
    case "SET_CART_ERROR":
      return { ...state, loading: { ...state.loading, cart: false }, error: { ...state.error, cart: action.error } };
    case "SET_ORDERS_LOADING":
      return { ...state, loading: { ...state.loading, orders: action.loading } };
    case "SET_ORDERS":
      return { ...state, orders: action.orders, loading: { ...state.loading, orders: false }, error: { ...state.error, orders: null } };
    case "SET_ORDERS_ERROR":
      return { ...state, loading: { ...state.loading, orders: false }, error: { ...state.error, orders: action.error } };
    case "ADD_ORDER":
      return { ...state, orders: [action.order, ...state.orders] };
    case "SET_ORDER_STATUS":
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.orderId ? { ...o, status: action.status } : o))
      };
    default:
      return state;
  }
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    products: [],
    cart: [],
    orders: [],
    loading: {
      products: false,
      cart: false,
      orders: false,
    },
    error: {
      products: null,
      cart: null,
      orders: null,
    },
  });

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Load cart on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Persist orders locally
  useEffect(() => {
    if (state.orders.length > 0) {
      AsyncStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(state.orders)).catch(() => undefined);
    }
  }, [state.orders]);

  const loadProducts = async () => {
    try {
      dispatch({ type: "SET_PRODUCTS_LOADING", loading: true });
      const products = await productsAPI.getProducts();
      // Map API products to store format
      const mappedProducts: Product[] = products.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        unit: p.unit || undefined,
        tags: [], // Tags not in API response
      }));
      dispatch({ type: "SET_PRODUCTS", products: mappedProducts });
    } catch (error) {
      console.error("Failed to load products:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load products";
      dispatch({ type: "SET_PRODUCTS_ERROR", error: errorMessage });
      // Set empty array on error so UI doesn't break
      dispatch({ type: "SET_PRODUCTS", products: [] });
    }
  };

  const loadCart = async () => {
    try {
      dispatch({ type: "SET_CART_LOADING", loading: true });
      const cart = await cartAPI.getCart();
      // Map API cart to store format
      const cartLines: CartLine[] = cart.items.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
      }));
      dispatch({ type: "SET_CART", cart: cartLines });
    } catch (error) {
      console.error("Failed to load cart:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load cart";
      // If it's an auth error, don't show error, just set empty cart
      if (errorMessage.includes("Authentication") || errorMessage.includes("401")) {
        dispatch({ type: "SET_CART", cart: [] });
      } else {
        dispatch({ type: "SET_CART_ERROR", error: errorMessage });
        dispatch({ type: "SET_CART", cart: [] });
      }
    }
  };

  const loadOrders = async () => {
    try {
      dispatch({ type: "SET_ORDERS_LOADING", loading: true });
      const orders = await ordersAPI.getOrders();
      // Map API orders to store format
      const mappedOrders: Order[] = orders.map((o) => ({
        id: o.id,
        createdAt: new Date(o.created_at).getTime(),
        status: (o.status.toUpperCase() === "PLACED" ? "PLACED" : o.status.toUpperCase() === "SHIPPED" ? "SHIPPED" : "DELIVERED") as OrderStatus,
        address: o.address || "",
        paymentMethod: o.payment_method as "COD",
        lines: o.items.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      }));
      dispatch({ type: "SET_ORDERS", orders: mappedOrders });
    } catch (error) {
      console.error("Failed to load orders:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load orders";
      // If it's an auth error, don't show error, just set empty orders
      if (errorMessage.includes("Authentication") || errorMessage.includes("401")) {
        dispatch({ type: "SET_ORDERS", orders: [] });
      } else {
        dispatch({ type: "SET_ORDERS_ERROR", error: errorMessage });
        // Try to load from local storage as fallback
        try {
          const ordersRaw = await AsyncStorage.getItem(STORAGE_ORDERS_KEY);
          if (ordersRaw) {
            const ordersParsed = JSON.parse(ordersRaw) as unknown;
            const orders = Array.isArray(ordersParsed)
              ? ordersParsed.filter((x) => x && typeof x === "object").map((x) => x as Order)
              : [];
            dispatch({ type: "SET_ORDERS", orders });
          } else {
            dispatch({ type: "SET_ORDERS", orders: [] });
          }
        } catch {
          dispatch({ type: "SET_ORDERS", orders: [] });
        }
      }
    }
  };

  const getProductById = (productId: string) => state.products.find((p) => p.id === productId);
  const getOrderById = (orderId: string) => state.orders.find((o) => o.id === orderId);

  const cartItemCount = useMemo(() => state.cart.reduce((acc, l) => acc + l.quantity, 0), [state.cart]);

  const cartTotal = useMemo(() => {
    return state.cart.reduce((acc, line) => {
      const product = getProductById(line.productId);
      if (!product) return acc;
      return acc + product.price * line.quantity;
    }, 0);
  }, [state.cart, state.products]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      dispatch({ type: "SET_CART_LOADING", loading: true });
      await cartAPI.addToCart(productId, quantity);
      await loadCart(); // Reload cart from API
    } catch (error) {
      console.error("Failed to add to cart:", error);
      dispatch({ type: "SET_CART_ERROR", error: error instanceof Error ? error.message : "Failed to add to cart" });
      throw error;
    }
  };

  const setCartQuantity = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: "SET_CART_LOADING", loading: true });
      await cartAPI.updateCartItem(productId, quantity);
      await loadCart(); // Reload cart from API
    } catch (error) {
      console.error("Failed to update cart:", error);
      dispatch({ type: "SET_CART_ERROR", error: error instanceof Error ? error.message : "Failed to update cart" });
      throw error;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      dispatch({ type: "SET_CART_LOADING", loading: true });
      await cartAPI.removeFromCart(productId);
      await loadCart(); // Reload cart from API
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      dispatch({ type: "SET_CART_ERROR", error: error instanceof Error ? error.message : "Failed to remove from cart" });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: "SET_CART_LOADING", loading: true });
      await cartAPI.clearCart();
      await loadCart(); // Reload cart from API
    } catch (error) {
      console.error("Failed to clear cart:", error);
      dispatch({ type: "SET_CART_ERROR", error: error instanceof Error ? error.message : "Failed to clear cart" });
      throw error;
    }
  };

  const placeOrder = async ({ address }: { address: string }): Promise<string> => {
    try {
      dispatch({ type: "SET_ORDERS_LOADING", loading: true });
      const order = await ordersAPI.createOrder(address);
      // Map API order to store format
      const mappedOrder: Order = {
        id: order.id,
        createdAt: new Date(order.created_at).getTime(),
        status: order.status.toUpperCase() as OrderStatus,
        address: order.address,
        paymentMethod: order.payment_method as "COD",
        lines: order.items.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      dispatch({ type: "ADD_ORDER", order: mappedOrder });
      await loadCart(); // Reload cart (should be empty now)
      return order.id;
    } catch (error) {
      console.error("Failed to place order:", error);
      dispatch({ type: "SET_ORDERS_ERROR", error: error instanceof Error ? error.message : "Failed to place order" });
      throw error;
    }
  };

  const value: AppStoreValue = {
    ...state,
    addToCart,
    setCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    setOrderStatus: (orderId, status) => dispatch({ type: "SET_ORDER_STATUS", orderId, status }),
    getProductById,
    getOrderById,
    refreshProducts: loadProducts,
    refreshCart: loadCart,
    refreshOrders: loadOrders,
    cartItemCount,
    cartTotal,
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore must be used inside AppProvider");
  }
  return ctx;
}
