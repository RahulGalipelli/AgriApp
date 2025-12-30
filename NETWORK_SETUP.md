# Network Setup Guide

## Problem
When switching WiFi networks, the app can't connect because the API IP address changes.

## Solution

### Quick Fix (Update IP Address)

1. **Find your computer's IP address:**
   - **Windows:** Open Command Prompt and run `ipconfig`
     - Look for "IPv4 Address" under your active network adapter
     - Example: `192.168.1.10`
   - **Mac/Linux:** Open Terminal and run `ifconfig`
     - Look for "inet" under your active network interface
     - Example: `192.168.1.10`

2. **Update the config file:**
   - Open `src/config.ts`
   - Update `DEV_API_IP` with your current IP address
   - Example: `const DEV_API_IP = "192.168.1.15";`

3. **Restart the app:**
   - Stop the Metro bundler (Ctrl+C)
   - Run `npm start` or `expo start` again
   - Reload the app on your device

### Alternative: Use ngrok for External Access

If you want to access the API from any network:

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Start your backend server:**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8003
   ```

3. **Create ngrok tunnel:**
   ```bash
   ngrok http 8003
   ```

4. **Update config.ts:**
   - Use the ngrok URL (e.g., `https://abc123.ngrok.io`)
   - Update `API_BASE_URL` in `src/config.ts`

### Alternative: Use Environment Variables

1. **Install react-native-config:**
   ```bash
   npm install react-native-config
   ```

2. **Create `.env` file:**
   ```
   API_BASE_URL=http://192.168.1.10:8003
   ```

3. **Update config.ts to use:**
   ```typescript
   import Config from 'react-native-config';
   export const API_BASE_URL = Config.API_BASE_URL;
   ```

## Current Configuration

Check `src/config.ts` for the current API settings.

## Troubleshooting

- **Can't connect:** Make sure your phone and computer are on the same WiFi network
- **Still not working:** Check firewall settings on your computer
- **Different port:** Update `DEV_API_PORT` in `src/config.ts`

