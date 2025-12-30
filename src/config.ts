/**
 * API Configuration
 * 
 * For development, update the IP address when switching networks:
 * - Find your computer's IP: ipconfig (Windows) or ifconfig (Mac/Linux)
 * - Update DEV_API_IP below
 * 
 * For production, use your production API URL
 */

// Development API IP - Update this when switching WiFi networks
// Find your IP: Windows: ipconfig | Mac/Linux: ifconfig
const DEV_API_IP = "172.23.208.1"; // Change this to your current network IP
const DEV_API_PORT = "8003"; // Or 8002 if that's your backend port

// Production API URL (update when deploying)
const PROD_API_URL = "https://your-production-api.com";

// Determine if we're in development or production
const __DEV__ = process.env.NODE_ENV !== "production";

// Use development URL in dev mode, production URL otherwise
export const API_BASE_URL = "https://unsatiated-carlita-overaffirmatively.ngrok-free.dev";

// Helper to get current config (useful for debugging)
export const getApiConfig = () => ({
  baseUrl: API_BASE_URL,
  isDev: __DEV__,
  ip: DEV_API_IP,
  port: DEV_API_PORT,
});
