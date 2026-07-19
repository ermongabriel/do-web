import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale } from "@/locale";
import { Button } from "@/components/ui/button";
import { Home, Mail, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { shadowButton } from "@/lib/utils";

type BackgroundType = "none" | "image" | "video";

type NotFoundProps = {
  // The HTTP status to display. Defaults to 404 for unknown/unmatched routes.
  // Pass the real code (e.g. 403, 500) wherever the error originates so the
  // page always shows the *actual* error number rather than a hardcoded 404.
  code?: number;
};

const STORAGE_KEY = "do-notfound-bg";

const NotFound = ({ code = 404 }: NotFoundProps) => {
  const { t, locale } = useLocale();
  // Read the saved background preference lazily (no setState-in-effect).
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(() => {
    if (typeof window === "undefined") return "none";
    const saved = window.localStorage.getItem(STORAGE_KEY) as BackgroundType | null;
    return saved === "image" || saved === "video" || saved === "none" ? saved : "none";
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -80]);
  const y2 = useTransform(scrollY, [0, 500], [0, 60]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const cycleBackground = () => {
    const next: BackgroundType =
      backgroundType === "none" ? "image" : backgroundType === "image" ? "video" : "none";
    setBackgroundType(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.current = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    mouseY.current = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
  };

  // Deterministic bubble field generated once (no Math.random during render,
  // which keeps the component pure and avoids the lint/React purity warning).
  const bubbles = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => {
        // simple seeded pseudo-random so positions are stable across renders
        const seed = (i * 9301 + 49297) % 233280;
        const r = seed / 233280;
        const r2 = ((i * 4096 + 150889) % 714025) / 714025;
        return {
          id: i,
          size: 50 + r * 260,
          left: r * 100,
          top: r2 * 100,
          blur: 20 + r * 50,
          x: r * 100 - 50,
          y: r2 * 100 - 50,
          duration: 10 + r * 10,
        };
      }),
    []
  );

  const is404 = code === 404;
  const errorCode = t("notfound.errorCode", `HTTP ${code}`).replace("{code}", String(code));
  const errorLabel = t("notfound.errorLabel", `Error ${code}`).replace("{code}", String(code));

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay bg-background"
    >
      {/* Ambient gradient glow */}
      <div
        className="pointer-events-none absolute -top-1/3 left-1/2 -z-10 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--gradient-color)" }}
        aria-hidden
      />

      {backgroundType === "image" && (
        <div className="absolute inset-0 -z-10">
          <img
            src="/404-bg.jpg"
            alt=""
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
      )}

      {backgroundType === "video" && (
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-20 dark:opacity-10"
          >
            <source src="/404-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
      )}

      {backgroundType === "none" && (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          {bubbles.map((b) => (
            <motion.div
              key={b.id}
              className="absolute rounded-full bg-foreground/5 dark:bg-foreground/10"
              style={{
                width: `${b.size}px`,
                height: `${b.size}px`,
                left: `${b.left}%`,
                top: `${b.top}%`,
                filter: `blur(${b.blur}px)`,
              }}
              animate={{ x: [0, b.x], y: [0, b.y], scale: [1, 1.2, 1] }}
              transition={{
                duration: b.duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <motion.div style={{ y: y1 }} className="relative inline-block">
            <h1
              className="text-[clamp(6rem,20vw,18rem)] font-display leading-none tracking-tighter select-none"
              style={{
                background:
                  locale === "fr"
                    ? "linear-gradient(135deg, #0a528e 0%, #bf9ce4 100%)"
                    : "var(--gradient-color)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
                filter: "drop-shadow(0 0 40px rgba(10,82,142,0.15))",
              }}
            >
              {code}
            </h1>
            <div className="absolute -inset-4 bg-gradient-primary/20 blur-3xl -z-10 rounded-full" />
          </motion.div>

          <motion.div style={{ y: y2, opacity }} className="mt-8 space-y-6">
            <div className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              <span>{errorLabel}</span>
              <span className="w-8 h-px bg-foreground/30" />
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display tracking-tight text-foreground">
              {is404 ? t("notfound.title") : t("notfound.title")}
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("notfound.description")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link to="/">
                <Button
                  size="lg"
                  className={`w-full sm:w-auto bg-gradient-primary rounded-none border-2 border-solid border-foreground text-primary-foreground ${shadowButton}`}
                >
                  <Home className="w-4 h-4 mr-2" />
                  {t("notfound.goHome")}
                </Button>
              </Link>

              <Link to="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className={`w-full sm:w-auto rounded-none border-2 border-solid border-foreground text-foreground ${shadowButton}`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {t("notfound.contactSupport")}
                </Button>
              </Link>

              <button
                onClick={cycleBackground}
                className="flex items-center gap-2 px-6 py-3 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors border border-foreground/10 hover:border-foreground/30"
                aria-label="Cycle background"
              >
                <Shuffle className="w-4 h-4" />
                {backgroundType === "none"
                  ? t("notfound.tryImage")
                  : backgroundType === "image"
                    ? t("notfound.tryVideo")
                    : t("notfound.tryNone")}
              </button>
            </div>

            <p className="text-xs text-muted-foreground/60 font-mono pt-8">{errorCode}</p>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="flex items-center gap-2 text-xs text-muted-foreground/50 font-mono"
        >
          <span>DO</span>
          <span className="w-1 h-1 rounded-full bg-foreground/30" />
          <span>{t("notfound.builtWithCare")}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
