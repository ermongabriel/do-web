import { useState } from "react";
import { useLocale } from "@/locale";
import { Globe, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";

const LOGO_IMAGE_SRC = "/logo.png";

// Minimal reading layout for legal/static documents: logo + language
// toggle + back-to-site, with a centered, comfortable prose column.
const LegalLayout = () => {
  const { locale, setLocale, t } = useLocale();
  const [logoImageFailed, setLogoImageFailed] = useState(false);

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "fr" : "en");
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay flex flex-col">
      <header className="relative z-30 flex items-center justify-between px-6 lg:px-12 h-16 sm:h-20 border-b border-foreground/10">
        <Link to="/" className="flex items-center gap-2 shrink-0 group" aria-label="Do — back to home">
          {!logoImageFailed ? (
            <img
              src={LOGO_IMAGE_SRC}
              alt="Do"
              onError={() => setLogoImageFailed(true)}
              className="h-9 w-auto max-w-[140px]"
            />
          ) : (
            <span className="font-display tracking-tight text-2xl">DO</span>
          )}
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-xs text-foreground/70 hover:text-foreground transition-colors duration-300 px-3 py-2 rounded-md border border-foreground/10"
            aria-label={t("auth.languageLabel")}
          >
            <Globe className="w-4 h-4" />
            {locale.toUpperCase()}
          </button>

          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 px-3 py-2 rounded-md border border-foreground/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t("auth.backHome")}</span>
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex-1">
        <Outlet />
      </div>

      <footer className="relative z-10 border-t border-foreground/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-6 flex items-center justify-center">
          <p className="text-xs text-muted-foreground text-center">
            {t("auth.footer")}
          </p>
        </div>
      </footer>
    </main>
  );
};

export default LegalLayout;
