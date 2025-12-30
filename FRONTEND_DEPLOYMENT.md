# Frontend Deployment Guide for QA Testing

This guide covers how to build and distribute your React Native/Expo app for QA testing.

## 🚀 Recommended: EAS Build (Easiest for QA)

**EAS (Expo Application Services)** is the official way to build and distribute Expo apps.

### Prerequisites

1. **Expo Account** (free): https://expo.dev
2. **EAS CLI** installed globally:
   ```bash
   npm install -g eas-cli
   ```

---

## Step 1: Install EAS CLI

```bash
npm install -g eas-cli
```

---

## Step 2: Login to Expo

```bash
eas login
```

Enter your Expo account credentials (create one at https://expo.dev if needed).

---

## Step 3: Configure EAS

The `eas.json` file has already been created. If you need to customize it, see the file.

---

## Step 4: Update API Configuration

Before building, make sure your `src/config.ts` points to your deployed backend:

```typescript
// For Render deployment
export const API_BASE_URL = "https://your-app.onrender.com";

// Or for local testing
export const API_BASE_URL = "https://your-ngrok-url.ngrok-free.dev";
```

---

## Step 5: Build for Android (APK)

### Build APK for QA Testing:

```bash
eas build --platform android --profile preview
```

This will:
- Build an APK file (can be installed directly on Android devices)
- Upload it to Expo servers
- Give you a download link

### Options:

**For Internal Testing (APK):**
```bash
eas build --platform android --profile preview
```

**For Production (AAB - Google Play format):**
```bash
eas build --platform android --profile production
```

**For iOS (requires Apple Developer account):**
```bash
eas build --platform ios --profile preview
```

---

## Step 6: Distribute to QA Team

After the build completes, you'll get:

1. **Download Link**: Share this with your QA team
2. **QR Code**: They can scan to download directly to their phones
3. **Installation Instructions**: Provided in the build output

### For Android:
- QA testers download the APK
- Enable "Install from Unknown Sources" on their device
- Install the APK file

### For iOS:
- Requires TestFlight (Apple's beta testing platform)
- Or use Ad Hoc distribution (limited to 100 devices)

---

## Alternative: Development Build (Faster Iteration)

For faster testing during development:

### 1. Start Development Server:
```bash
npm run start:tunnel
```

### 2. Share QR Code:
- QA testers scan QR code with Expo Go app
- App loads directly (no build needed)
- Updates instantly when you make changes

**Limitations:**
- Requires Expo Go app installed
- Some native features may not work
- Slower than standalone builds

---

## Build Profiles Explained

The `eas.json` file defines different build profiles:

### `preview` (Recommended for QA)
- Builds APK/IPA for direct installation
- No app store submission needed
- Perfect for internal testing

### `production`
- Builds AAB (Android) / IPA (iOS)
- For app store submission
- Optimized and signed for release

### `development`
- Development builds with debugging
- Can use custom native code
- Slower builds

---

## Quick Commands

```bash
# Build Android APK for QA
eas build --platform android --profile preview

# Build iOS for QA (requires Apple Developer)
eas build --platform ios --profile preview

# Build both platforms
eas build --platform all --profile preview

# Check build status
eas build:list

# Download latest build
eas build:download
```

---

## Updating the App

### Option 1: OTA Updates (Over-The-Air)
For JavaScript/TypeScript changes only (no native changes):

```bash
eas update --branch preview --message "Bug fixes"
```

QA testers will get the update automatically when they open the app.

### Option 2: New Build
For native changes or major updates:

```bash
eas build --platform android --profile preview
```

---

## Environment-Specific Builds

You can create different builds for different environments:

### 1. Update `eas.json`:
```json
{
  "build": {
    "preview": {
      "env": {
        "API_BASE_URL": "https://qa-api.onrender.com"
      }
    },
    "production": {
      "env": {
        "API_BASE_URL": "https://api.production.com"
      }
    }
  }
}
```

### 2. Use in `src/config.ts`:
```typescript
export const API_BASE_URL = process.env.API_BASE_URL || "https://default-api.com";
```

---

## Troubleshooting

### Build Fails
- Check `app.json` configuration
- Verify all dependencies are in `package.json`
- Check EAS build logs: `eas build:view`

### APK Won't Install
- Enable "Install from Unknown Sources" on Android
- Check if device architecture matches (arm64 vs x86)

### App Crashes on Launch
- Check backend API URL is correct
- Verify all environment variables are set
- Check device logs: `adb logcat` (Android)

---

## Cost

- **EAS Build**: Free tier includes:
  - 30 builds per month
  - Unlimited preview builds (after first 30)
  - Perfect for QA testing!

---

## Recommended Workflow for QA

1. **Initial Setup:**
   ```bash
   eas build --platform android --profile preview
   ```
   Share APK with QA team

2. **During Development:**
   - Use `npm run start:tunnel` for quick testing
   - QA uses Expo Go app to test

3. **Before Release:**
   ```bash
   eas build --platform all --profile preview
   ```
   Final QA testing with standalone builds

4. **Production:**
   ```bash
   eas build --platform all --profile production
   ```
   Submit to app stores

---

## Next Steps

1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Build: `eas build --platform android --profile preview`
4. Share APK with QA team
5. Update backend URL in `src/config.ts` to your Render deployment

