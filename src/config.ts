/**
 * API Configuration
 *
 * Default: local backend (DEV_API_IP:DEV_API_PORT). Update DEV_API_IP when you change WiFi (ipconfig / ifconfig).
 * For tunnel or production: set EXPO_PUBLIC_API_URL in .env to the cloud URL, then: npx expo start -c
 */

// Local backend - change IP when switching networks
const DEV_API_IP = "172.23.208.1";
const DEV_API_PORT = "8003";
const LOCAL_API_URL = `http://${DEV_API_IP}:${DEV_API_PORT}`;

// Production (use only when EXPO_PUBLIC_API_URL is set, e.g. for tunnel)
const PROD_API_URL = "https://agriapp-backend-88a1.onrender.com";

// Default to local; override with EXPO_PUBLIC_API_URL in .env for production/tunnel
export const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_URL) ||
  LOCAL_API_URL;

if (__DEV__ !== false) {
  console.log("API Base URL:", API_BASE_URL);
}

// Helper to get current config (useful for debugging)
export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  localUrl: LOCAL_API_URL,
  ip: DEV_API_IP,
  port: DEV_API_PORT,
});
