import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/locale";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useService } from "@/di/context";
import { TOKENS } from "@/di/container";
import { AuthService } from "@/services/authService";
import { Seo } from "@/components/Seo";
import { shadowButton, shadowInput, cn } from "@/lib/utils";

const Login = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const auth = useService<AuthService>(TOKENS.AuthService);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = t("login.pageTitle");
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      await auth.login(email, password);
      const home = auth.getHome();
      navigate(home ?? "/", { replace: true });
    } catch (err) {
      const apiError = err as { message?: string };
      setError(apiError.message || t("login.errorGeneric", "Invalid email or password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      <Seo
        title={t("login.title")}
        description={t("login.description")}
        path="/auth/login"
        noindex
      />

      {/* Subtle grid lines background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{
              top: `${16.66 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(8)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/10"
            style={{
              left: `${12.5 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>

      <div className="relative text-center mb-10">
        <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
          <span className="w-8 h-px bg-foreground/30" />
          {t("login.eyebrow")}
          <span className="w-8 h-px bg-foreground/30" />
        </span>

        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground mb-6">
          {t("login.title")}
        </h1>

        <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
          {t("login.description")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label
            htmlFor="email"
            className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground"
          >
            {t("login.emailLabel")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("login.emailPlaceholder")}
            required
            autoComplete="email"
            className={cn("w-full px-5 py-4", shadowInput)}
            style={{ boxShadow: "4px 4px 0px 0px var(--foreground)" }}
          />
        </div>

        <div className="relative">
          <label
            htmlFor="password"
            className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground"
          >
            {t("login.passwordLabel")}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("login.passwordPlaceholder")}
              required
              autoComplete="current-password"
              className={cn("w-full px-5 py-4 pr-12", shadowInput)}
              style={{ boxShadow: "4px 4px 0px 0px var(--foreground)" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div />
          <Link
            to="/auth/forgot-password"
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            {t("login.forgotPassword")}
          </Link>
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "group flex w-full items-center justify-center gap-2 rounded-none border-2 border-solid border-foreground bg-gradient-primary px-8 py-4 text-sm font-medium text-primary-foreground",
            shadowButton,
            loading && "opacity-70 cursor-wait"
          )}
        >
          {loading ? "Signing in..." : t("login.submit")}
          {!loading && (
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        {t("login.noAccount")}{" "}
        <Link
          to="/auth/register"
          className="underline underline-offset-4 hover:text-foreground"
        >
          {t("login.registerCta")}
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground/60 font-mono mt-8">
        {t("login.termsNotice", {
          terms: t("login.termsLink"),
          privacy: t("login.privacyLink"),
        }        ) as unknown as string}
      </p>
    </motion.div>
  );
};

export default Login;
