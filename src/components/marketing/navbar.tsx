import { useState, useEffect } from "react";
import { useLocale } from "@/locale";
import { Button } from "@/components/ui/button";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { shadowButton } from "@/lib/utils";

const navLinks = [
  { nameKey: "nav.features", href: "/#features" },
  { nameKey: "nav.howItWorks", href: "/#how-it-works" },
  { nameKey: "nav.aiTutor", href: "/ai-tutor" },
  { nameKey: "nav.pricing", href: "/#pricing" },
  { nameKey: "nav.about", href: "/about" },
  { nameKey: "nav.contact", href: "/contact" },
];

// --- Logo config -----------------------------------------------------
// Flip this to switch between your image logo and the plain text logo.
// Set to false any time you want to preview/use the text version instead
// (e.g. while your image logo is still being finalized).
const USE_IMAGE_LOGO = true;

// Path to your logo file. Place the image in the `public` folder (e.g.
// `public/logo.png`) and reference it from the root here, or import it
// from `src/assets` and pass the imported value instead of a string path.
const LOGO_IMAGE_SRC = "/logo.png";
// -----------------------------------------------------------------------

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();
  const [isDark, setIsDark] = useState(false);
  const [logoImageFailed, setLogoImageFailed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile menu is open, and let Escape close it —
  // both matter for usability on small devices where the overlay covers everything.
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    const handleKey = (e: { key: string; }) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [isMobileMenuOpen]);

  // Initialize theme from saved preference or system setting
  useEffect(() => {
    const saved = localStorage.getItem("do-theme");
    const prefersDark =
      saved === "dark" ||
      (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("do-theme", next ? "dark" : "light");
  };

  const toggleLanguage = () => {
    const nextLang = locale === "en" ? "fr" : "en";
    setLocale(nextLang);
  };

  // Show the image logo only if it's enabled AND hasn't failed to load.
  // If the image 404s or fails, we automatically fall back to the text
  // logo so the navbar never ends up broken/empty. (Restored — this
  // safety net was accidentally bypassed in the last edit.)
  const showImageLogo = USE_IMAGE_LOGO && !logoImageFailed;

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4" : "top-0 left-0 right-0"
      }`}
    >
      {/* relative + z-50 here is what keeps the nav (and the mobile
          menu toggle button) stacked ABOVE the full-screen mobile
          overlay below, which sits at z-40. Without this, the nav is
          unpositioned and the overlay paints over it, hiding the close (X) button. */}
      <nav
        className={`relative z-50 mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-4 sm:px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-16 sm:h-20"
          }`}
        >
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group shrink-0">
            {showImageLogo ? (
              <img
                src={LOGO_IMAGE_SRC}
                alt="Do"
                onError={() => setLogoImageFailed(true)}
                className="w-auto max-w-[140px] h-9 transition-all duration-500"
              />
            ) : (
              <>
                <span
                  className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl"}`}
                >
                  DO
                </span>
                <span
                  className={`text-muted-foreground font-mono transition-all duration-500 ${isScrolled ? "text-[10px] mt-0.5" : "text-xs mt-1"}`}
                >
                  TM
                </span>
              </>
            )}
          </a>

          {/* Desktop Navigation — lg breakpoint, not md: with 5 links plus
              language/theme toggles plus auth buttons, md (768px) tablets
              were too cramped and would wrap/overflow. */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.nameKey}
                to={link.href}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 relative group whitespace-nowrap"
              >
                {t(link.nameKey)}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-xs text-foreground/70 hover:text-foreground transition-colors duration-300 px-2 py-1.5 rounded-md hover:bg-foreground/5"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              {locale.toUpperCase()}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <span className="w-px h-5 bg-foreground/10 mx-1" />

            {/* <a
              href="/auth/login"
              className={`text-foreground/70 hover:text-foreground transition-all duration-500 whitespace-nowrap ${isScrolled ? "text-xs" : "text-sm"}`}
            >
              {t("nav.signIn")}
            </a> */}
            <Link to="/auth/waitlist">
              <Button
                size="sm"
                className={`bg-gradient-primary rounded-none text-primary-foreground whitespace-nowrap ${shadowButton} ${isScrolled ? "px-4 h-8 text-xs" : "px-6"}`}
              >
                {t("nav.joinWaitlist")}
              </Button>
            </Link>
          </div>

          {/* Mobile / Tablet Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -mr-2 shrink-0"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay (z-40, sits below nav's z-50) */}
      <div
        className={`lg:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-6 sm:px-8 pt-24 sm:pt-28 pb-8 overflow-y-auto">
          {/* Language & theme toggles */}
          <div
            className={`flex items-center gap-3 mb-4 transition-all duration-500 ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 px-3 py-2 rounded-md border border-foreground/10"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              {locale.toUpperCase()}
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 px-3 py-2 rounded-md border border-foreground/10"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? t("nav.lightMode") : t("nav.darkMode")}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center gap-6 sm:gap-8 min-h-0">
            {navLinks.map((link, i) => (
              <Link
                key={link.nameKey}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-4xl sm:text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms",
                }}
              >
                {t(link.nameKey)}
              </Link>
            ))}
          </div>

          {/* Bottom CTAs — now share the same hard-shadow style as the
              desktop buttons instead of a plain outline/filled pill. */}
          <div
            className={`flex gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            {/* <Link to={"/auth/login"} className="flex-1">
              <Button
                variant="outline"
                className={`w-full rounded-none h-14 text-base ${shadowButtonClasses}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.signIn")}
              </Button>
            </Link> */}
            <Link to={"/auth/waitlist"} className="flex-1">
              <Button
                className={`w-full bg-gradient-primary text-primary-foreground rounded-none h-14 text-base ${shadowButton}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.joinWaitlist")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;