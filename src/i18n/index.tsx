import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// Import translations using dynamic require for Metro bundler compatibility
let en: any, hi: any, ta: any, te: any, kn: any, ml: any;

try {
  en = require("./translations/en").default;
  hi = require("./translations/hi").default;
  ta = require("./translations/ta").default;
  te = require("./translations/te").default;
  kn = require("./translations/kn").default;
  ml = require("./translations/ml").default;
} catch (e) {
  // Fallback if imports fail
  console.error("Failed to load translations:", e);
  en = hi = ta = te = kn = ml = {};
}

type LanguageCode = "en" | "hi" | "ta" | "te" | "kn" | "ml";

const translations: Record<LanguageCode, any> = {
  en,
  hi,
  ta,
  te,
  kn,
  ml,
};

interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  t: (key: string, params?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage && translations[savedLanguage as LanguageCode]) {
        setLanguageState(savedLanguage as LanguageCode);
      }
    } catch (error) {
      console.error("Failed to load language:", error);
    } finally {
      setIsReady(true);
    }
  };

  const setLanguage = async (lang: LanguageCode) => {
    try {
      await AsyncStorage.setItem("language", lang);
      setLanguageState(lang);
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }

    if (typeof value !== "string") {
      return key;
    }

    // Replace parameters in translation
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
        return params[paramKey] || match;
      });
    }

    return value;
  };

  if (!isReady) {
    return null; // Or a loading spinner
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

