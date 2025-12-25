# Internationalization (i18n) Guide

This app supports multiple regional languages: English, Hindi, Tamil, Telugu, Kannada, and Malayalam.

## How It Works

1. **Language Selection**: Users select their preferred language on the Language Screen
2. **Persistence**: The selected language is saved to AsyncStorage and persists across app restarts
3. **Dynamic Updates**: When language is changed, all text in the app updates immediately
4. **Fallback**: If a translation is missing, it falls back to English

## Using Translations in Components

### 1. Import the hook

```typescript
import { useI18n } from "../i18n";
```

### 2. Use the `t` function

```typescript
const { t } = useI18n();

// Simple translation
<Text>{t("home.welcome")}</Text>

// Translation with parameters
<Text>{t("community.noContent", { type: "videos" })}</Text>
```

### 3. Translation Key Structure

Translation keys use dot notation:
- `common.back` - Common translations
- `home.welcome` - Screen-specific translations
- `login.title` - Feature-specific translations

## Available Languages

- `en` - English
- `hi` - Hindi (हिंदी)
- `ta` - Tamil (தமிழ்)
- `te` - Telugu (తెలుగు)
- `kn` - Kannada (ಕನ್ನಡ)
- `ml` - Malayalam (മലയാളം)

## Adding New Translations

1. Add the key-value pair to all language files in `src/i18n/translations/`
2. Use the key in your component with `t("your.key")`

## Example Usage

```typescript
import { useI18n } from "../i18n";

export default function MyScreen() {
  const { t, language, setLanguage } = useI18n();
  
  return (
    <View>
      <Text>{t("home.welcome")}</Text>
      <Button title={t("common.continue")} />
    </View>
  );
}
```

## Language Context

The `I18nProvider` wraps the entire app in `AppNavigator.tsx`, making translations available throughout the app.

