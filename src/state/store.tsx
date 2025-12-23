import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CartLine, Order, OrderStatus, Product } from "./types";

type AppState = {
  products: Product[];
  cart: CartLine[];
  orders: Order[];
};

type AppActions = {
  addToCart: (productId: string, quantity?: number) => void;
  setCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (args: { address: string }) => string;
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  getProductById: (productId: string) => Product | undefined;
  getOrderById: (orderId: string) => Order | undefined;
  cartItemCount: number;
  cartTotal: number;
};

type AppStoreValue = AppState & AppActions;

const STORAGE_CART_KEY = "appState_v1_cart";
const STORAGE_ORDERS_KEY = "appState_v1_orders";

const SAMPLE_PRODUCTS: Product[] = [
  { id: "p1", name: "Neem Oil Spray", price: 199, unit: "250 ml", tags: ["organic", "spray"] },
  { id: "p2", name: "Copper Fungicide", price: 299, unit: "250 g", tags: ["fungicide"] },
  { id: "p3", name: "NPK Fertilizer", price: 349, unit: "1 kg", tags: ["fertilizer"] },
  { id: "p4", name: "Micronutrient Mix", price: 129, unit: "250 g", tags: ["nutrients"] }
];

type Action =
  | { type: "LOAD_PERSISTED"; cart: CartLine[]; orders: Order[] }
  | { type: "ADD_TO_CART"; productId: string; quantity: number }
  | { type: "SET_CART_QTY"; productId: string; quantity: number }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "CLEAR_CART" }
  | { type: "ADD_ORDER"; order: Order }
  | { type: "SET_ORDER_STATUS"; orderId: string; status: OrderStatus };

function clampQuantity(qty: number): number {
  if (!Number.isFinite(qty)) return 1;
  if (qty <= 0) return 0;
  if (qty > 99) return 99;
  return Math.floor(qty);
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOAD_PERSISTED":
      return { ...state, cart: action.cart, orders: action.orders };
    case "ADD_TO_CART": {
      const quantity = clampQuantity(action.quantity);
      if (quantity === 0) return state;
      const existing = state.cart.find((l) => l.productId === action.productId);
      if (existing) {
        const nextCart = state.cart.map((l) =>
          l.productId === action.productId ? { ...l, quantity: clampQuantity(l.quantity + quantity) } : l
        );
        return { ...state, cart: nextCart };
      }
      return { ...state, cart: [...state.cart, { productId: action.productId, quantity }] };
    }
    case "SET_CART_QTY": {
      const quantity = clampQuantity(action.quantity);
      if (quantity === 0) {
        return { ...state, cart: state.cart.filter((l) => l.productId !== action.productId) };
      }
      const exists = state.cart.some((l) => l.productId === action.productId);
      if (!exists) return state;
      return {
        ...state,
        cart: state.cart.map((l) => (l.productId === action.productId ? { ...l, quantity } : l))
      };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((l) => l.productId !== action.productId) };
    case "CLEAR_CART":
      return { ...state, cart: [] };
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
    products: SAMPLE_PRODUCTS,
    cart: [],
    orders: []
  });

  useEffect(() => {
    const load = async () => {
      const [cartRaw, ordersRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_CART_KEY),
        AsyncStorage.getItem(STORAGE_ORDERS_KEY)
      ]);

      const cartParsed = cartRaw ? (JSON.parse(cartRaw) as unknown) : [];
      const ordersParsed = ordersRaw ? (JSON.parse(ordersRaw) as unknown) : [];

      const cart = Array.isArray(cartParsed)
        ? cartParsed
            .filter((x) => x && typeof x === "object")
            .map((x) => x as CartLine)
            .filter((x) => typeof x.productId === "string" && typeof x.quantity === "number")
            .map((x) => ({ productId: x.productId, quantity: clampQuantity(x.quantity) }))
        : [];

      const orders = Array.isArray(ordersParsed)
        ? ordersParsed.filter((x) => x && typeof x === "object").map((x) => x as Order)
        : [];

      dispatch({ type: "LOAD_PERSISTED", cart, orders });
    };

    load().catch(() => {
      dispatch({ type: "LOAD_PERSISTED", cart: [], orders: [] });
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_CART_KEY, JSON.stringify(state.cart)).catch(() => undefined);
  }, [state.cart]);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(state.orders)).catch(() => undefined);
  }, [state.orders]);

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

  const value: AppStoreValue = {
    ...state,
    addToCart: (productId, quantity = 1) => dispatch({ type: "ADD_TO_CART", productId, quantity }),
    setCartQuantity: (productId, quantity) => dispatch({ type: "SET_CART_QTY", productId, quantity }),
    removeFromCart: (productId) => dispatch({ type: "REMOVE_FROM_CART", productId }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    placeOrder: ({ address }) => {
      const trimmed = address.trim();
      const id = `ORD-${Date.now()}`;
      const lines = state.cart
        .map((l) => {
          const product = getProductById(l.productId);
          if (!product) return null;
          return { productId: l.productId, quantity: l.quantity, price: product.price };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);

      const order: Order = {
        id,
        createdAt: Date.now(),
        status: "PLACED",
        address: trimmed.length > 0 ? trimmed : "Address not provided",
        paymentMethod: "COD",
        lines
      };
      dispatch({ type: "ADD_ORDER", order });
      dispatch({ type: "CLEAR_CART" });
      return id;
    },
    setOrderStatus: (orderId, status) => dispatch({ type: "SET_ORDER_STATUS", orderId, status }),
    getProductById,
    getOrderById,
    cartItemCount,
    cartTotal
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

