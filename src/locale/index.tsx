import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "./en.json";
import fr from "./fr.json";

const messages = {
  en,
  fr,
} as const;

type LocaleCode = keyof typeof messages;
type TranslationValue =
  | string
  | number
  | boolean
  | null
  | TranslationValue[]
  | { [key: string]: TranslationValue };
const DEFAULT_LOCALE: LocaleCode = "en";

const getSavedLocale = (): LocaleCode | null => {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem("do-language")?.toLowerCase();
  if (!saved) return null;
  return saved in messages ? (saved as LocaleCode) : null;
};

const getBrowserLocale = (): LocaleCode => {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const nav = window.navigator.language.slice(0, 2).toLowerCase();
  return nav in messages ? (nav as LocaleCode) : DEFAULT_LOCALE;
};

const getInitialLocale = (): LocaleCode => {
  return getSavedLocale() ?? getBrowserLocale();
};

const LocaleContext = createContext<{
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: <T extends TranslationValue = string>(key: string, fallback?: T) => T;
}>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key, fallback) => (fallback ?? key) as any,
});

const resolveKey = (obj: Record<string, any>, key: string): TranslationValue | undefined => {
  return key.split(".").reduce<TranslationValue | undefined>((current, part) => {
    if (current && typeof current === "object" && part in current) {
      return (current as any)[part];
    }
    return undefined;
  }, obj as any);
};

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<LocaleCode>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem("do-language", locale);
  }, [locale]);

  const t = useMemo(
    () =>
      <T extends TranslationValue = string>(key: string, fallback?: T): T => {
      const value = resolveKey(messages[locale], key);
      return (value ?? fallback ?? key) as T;
    },
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
