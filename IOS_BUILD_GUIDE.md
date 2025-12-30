# iOS Build Guide for QA Testing

This guide covers building and distributing iOS apps for QA testing using EAS Build.

## 📋 Prerequisites

### 1. Apple Developer Account

You need an **Apple Developer Account** to build iOS apps:

- **Free Account**: Limited - can only build for simulator, not real devices
- **Paid Account ($99/year)**: Required for:
  - Building for real devices
  - TestFlight distribution
  - App Store submission

**Sign up at:** https://developer.apple.com/programs/

### 2. EAS CLI Installed

```bash
npm install -g eas-cli
```

### 3. Logged into Expo

```bash
eas login
```

---

## 🚀 Step-by-Step iOS Build Process

### Step 1: Configure Apple Developer Account

1. **Login to Apple Developer Portal:**
   - Go to https://developer.apple.com/account
   - Sign in with your Apple ID

2. **Get your Team ID:**
   - Go to Membership section
   - Copy your **Team ID** (looks like: `ABC123DEF4`)

### Step 2: Configure EAS for iOS

EAS will automatically configure certificates and provisioning profiles, but you need to provide credentials:

**Option A: Automatic (Recommended - EAS manages everything)**

```bash
eas build:configure
```

This will:
- Ask for your Apple ID
- Ask for your Apple Developer Team
- Automatically generate certificates and provisioning profiles
- Store credentials securely

**Option B: Manual (Advanced)**

If you prefer to manage certificates yourself, you can provide them manually.

### Step 3: Update app.json (Already Done)

Your `app.json` already has:
```json
{
  "ios": {
    "bundleIdentifier": "com.rahulgalipelli.AgriCure",
    "supportsTablet": true
  }
}
```

✅ This is correct!

### Step 4: Build for iOS

#### For Real Devices (Requires Paid Apple Developer Account):

```bash
eas build --platform ios --profile preview
```

Or use the npm script:
```bash
npm run build:ios
```

#### For Simulator Only (Free Account):

```bash
eas build --platform ios --profile preview --local
```

**Note:** Simulator builds can only run on Mac simulators, not real devices.

### Step 5: Wait for Build

- Build takes **15-30 minutes** (iOS builds are slower than Android)
- You'll get a notification when it's done
- Check status: `eas build:list`

### Step 6: Distribute to QA Team

After build completes, you have **3 options**:

---

## 📱 Distribution Options

### Option 1: TestFlight (Recommended for QA)

**Best for:** Professional QA testing, multiple testers

**Steps:**

1. **Submit to TestFlight:**
   ```bash
   eas submit --platform ios
   ```

2. **Wait for App Store Review:**
   - First submission: 24-48 hours
   - Updates: Usually faster (few hours)

3. **Add Testers:**
   - Go to App Store Connect
   - Navigate to TestFlight
   - Add internal testers (up to 100)
   - Add external testers (up to 10,000) - requires review

4. **Share with QA:**
   - Testers get email invitation
   - They install TestFlight app
   - Download your app from TestFlight

**Pros:**
- ✅ Professional distribution
- ✅ Easy updates
- ✅ Built-in crash reporting
- ✅ Supports up to 10,000 external testers

**Cons:**
- ❌ Requires App Store review (first time)
- ❌ Takes 24-48 hours initially

---

### Option 2: Ad Hoc Distribution

**Best for:** Quick testing with limited devices

**Steps:**

1. **Build with Ad Hoc profile:**
   ```bash
   eas build --platform ios --profile preview
   ```

2. **Register Device UDIDs:**
   - Get UDID from each tester's device
   - Add to Apple Developer Portal → Devices
   - EAS will automatically include them

3. **Download and Install:**
   - Download IPA file from EAS
   - Testers install via:
     - **macOS:** Drag to iTunes/Finder
     - **Windows:** Use 3uTools or similar
     - **OTA:** Use services like Diawi or Installonair

**Pros:**
- ✅ No App Store review
- ✅ Works immediately

**Cons:**
- ❌ Limited to 100 devices per year
- ❌ More complex installation process
- ❌ Need device UDIDs upfront

---

### Option 3: Development Build (Fastest)

**Best for:** Development and quick testing

**Steps:**

1. **Build development client:**
   ```bash
   eas build --platform ios --profile development
   ```

2. **Install on device:**
   - Download and install via TestFlight or Ad Hoc
   - App connects to your dev server
   - Updates instantly when you make changes

**Pros:**
- ✅ Instant updates (no rebuild needed)
- ✅ Great for development

**Cons:**
- ❌ Requires development server running
- ❌ Not suitable for final QA

---

## 🔧 Quick Commands

```bash
# Build for iOS (real devices)
eas build --platform ios --profile preview

# Build for iOS simulator
eas build --platform ios --profile preview --local

# Submit to TestFlight
eas submit --platform ios

# Check build status
eas build:list

# Download latest build
eas build:download

# View build logs
eas build:view
```

---

## 📝 Configuration Files

### eas.json (Already Configured)

```json
{
  "build": {
    "preview": {
      "ios": {
        "simulator": false  // Build for real devices
      }
    }
  }
}
```

### app.json (Already Configured)

```json
{
  "ios": {
    "bundleIdentifier": "com.rahulgalipelli.AgriCure",
    "supportsTablet": true
  }
}
```

---

## ⚠️ Common Issues & Solutions

### Issue: "No Apple Developer Account"

**Solution:**
- Sign up at https://developer.apple.com/programs/
- Pay $99/year fee
- Wait for account activation (usually instant)

### Issue: "Invalid Bundle Identifier"

**Solution:**
- Bundle ID must be unique
- Format: `com.yourcompany.appname`
- Already set correctly: `com.rahulgalipelli.AgriCure`

### Issue: "Certificate Expired"

**Solution:**
- EAS automatically renews certificates
- Run: `eas build:configure` to refresh

### Issue: "Device Not Registered"

**Solution:**
- Get device UDID from tester
- Add to Apple Developer Portal
- Rebuild the app

### Issue: "Build Takes Too Long"

**Solution:**
- iOS builds are slower (15-30 min is normal)
- Use `--local` flag to build on your Mac (faster)
- Requires Xcode installed

---

## 💰 Cost Breakdown

### Apple Developer Program
- **$99/year** - Required for real device builds

### EAS Build
- **Free tier:** 30 builds/month
- **Paid:** $29/month for more builds

### TestFlight
- **Free** - Included with Apple Developer account

---

## 🎯 Recommended Workflow for QA

### Initial Setup:
1. ✅ Get Apple Developer account ($99/year)
2. ✅ Run `eas build:configure`
3. ✅ Build: `eas build --platform ios --profile preview`
4. ✅ Submit: `eas submit --platform ios`
5. ✅ Add testers in App Store Connect

### During Development:
- Use development builds for quick testing
- Use TestFlight for formal QA testing

### Before Release:
- Final build with production profile
- Submit to App Store for review

---

## 📱 Getting Device UDID (For Ad Hoc)

### On iPhone/iPad:
1. Connect to Mac
2. Open Finder (macOS Catalina+) or iTunes
3. Select device
4. Click on serial number to reveal UDID

### On Windows:
1. Use 3uTools or similar
2. Connect device
3. View device info → UDID

### Alternative:
- Testers can find it in Settings → General → About
- Or use online tools (they send UDID via email)

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Configure (first time only)
eas build:configure

# 2. Build
eas build --platform ios --profile preview

# 3. Submit to TestFlight
eas submit --platform ios

# 4. Add testers in App Store Connect
```

**That's it!** Your QA team will get TestFlight invitations.

---

## 📚 Additional Resources

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **TestFlight Guide:** https://developer.apple.com/testflight/
- **Apple Developer:** https://developer.apple.com/

---

## ⚡ Pro Tips

1. **Use TestFlight for QA** - It's the most professional and easiest
2. **Build in batches** - iOS builds are slow, plan ahead
3. **Keep certificates updated** - EAS handles this automatically
4. **Use development builds** - For quick iteration during development
5. **Monitor build status** - Use `eas build:list` to check progress

