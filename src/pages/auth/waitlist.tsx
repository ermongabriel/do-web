import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/locale";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { shadowInput, shadowButton } from "@/lib/utils";
import { useService } from "@/di/context";
import { TOKENS } from "@/di/container";
import { ApiClient, ApiError } from "@/services/apiClient";

type FormState = {
  firstName: string;
  lastName: string;
  school: string;
  email: string;
};

const Waitlist = () => {
  const { t } = useLocale();
  const api = useService<ApiClient>(TOKENS.ApiClient);
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    school: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isNotOwner, setIsNotOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = t("waitlist.pageTitle");
  }, [t]);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;

    setLoading(true);
    setError(null);

    try {
      await api.post<{ id: string }>("/waitlist", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        schoolName: isNotOwner ? undefined : form.school || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        const body = err.body as { message?: string };
        setError(body?.message || `Something went wrong (${err.status})`);
      } else {
        setError("Something went wrong. Please try again.");
      }
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
          {t("waitlist.eyebrow")}
          <span className="w-8 h-px bg-foreground/30" />
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display tracking-tight text-foreground mb-6">
          {t("waitlist.title")}
        </h1>

        <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
          {t("waitlist.description")}
        </p>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="firstName" className="sr-only">
                {t("waitlist.firstNameLabel")}
              </label>
              <input
                id="firstName"
                type="text"
                value={form.firstName}
                onChange={update("firstName")}
                placeholder={t("waitlist.firstNamePlaceholder")}
                autoComplete="given-name"
                className={`w-full px-5 py-4 ${shadowInput}`}
                style={{ boxShadow: "4px 4px 0px 0px var(--foreground)" }}
              />
            </div>

            <div className="relative">
              <label htmlFor="lastName" className="sr-only">
                {t("waitlist.lastNameLabel")}
              </label>
              <input
                id="lastName"
                type="text"
                value={form.lastName}
                onChange={update("lastName")}
                placeholder={t("waitlist.lastNamePlaceholder")}
                autoComplete="family-name"
                className={`w-full px-5 py-4 ${shadowInput}`}
                style={{ boxShadow: "4px 4px 0px 0px var(--foreground)" }}
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="school" className="sr-only">
              {t("waitlist.schoolLabel")}
            </label>
            <input
              id="school"
              type="text"
              value={form.school}
              onChange={update("school")}
              placeholder={t("waitlist.schoolPlaceholder")}
              autoComplete="organization"
              disabled={isNotOwner}
              className={`w-full px-5 py-4 ${shadowInput} ${isNotOwner ? "opacity-50 cursor-not-allowed" : ""}`}
              style={{ boxShadow: "4px 4px 0px 0px var(--foreground)" }}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isNotOwner"
              type="checkbox"
              checked={isNotOwner}
              onChange={(e) => {
                setIsNotOwner(e.target.checked);
                if (e.target.checked) {
                  setForm((prev) => ({ ...prev, school: "" }));
                }
              }}
              className="w-5 h-5 cursor-pointer accent-foreground"
            />
            <label htmlFor="isNotOwner" className="text-sm cursor-pointer text-muted-foreground">
              {t("waitlist.notOwnerLabel", "I'm not the owner of this school")}
            </label>
          </div>

          <div className="relative">
            <label htmlFor="email" className="sr-only">
              {t("waitlist.emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder={t("waitlist.emailPlaceholder")}
              required
              autoComplete="email"
              className={`w-full px-5 py-4 ${shadowInput}`}
              style={{ boxShadow: "4px 4px 0px 0px var(--foreground)" }}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className={`w-full bg-gradient-primary rounded-none border-2 border-solid border-foreground text-primary-foreground ${shadowButton} ${
              loading ? "opacity-70 cursor-wait" : ""
            }`}
          >
            {loading ? "Submitting..." : t("waitlist.submit")}
            {!loading && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
          </Button>
        </form>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div
            className="inline-flex items-center justify-center w-12 h-12 border-2 border-solid border-foreground bg-gradient-primary text-primary-foreground mb-4"
            style={{ boxShadow: "3px 3px 0px 0px var(--foreground)" }}
          >
            <Check className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-display tracking-tight text-foreground">
            {t("waitlist.successTitle")}
          </h2>
          <p className="text-muted-foreground">
            {t("waitlist.successDescription")}
          </p>
          <a
            href="https://chat.whatsapp.com/IJ7vvEj2om0BpG8zt9PsyT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-solid border-foreground bg-primary text-foreground hover:bg-gray-50 transition-colors"
            style={{ boxShadow: "4px 4px 0px 0px var(--foreground)" }}
          >
            <span>{t("waitlist.whatsAppCta")}</span>
          </a>
        </motion.div>
      )}

      <p className="text-center text-xs text-muted-foreground/60 font-mono mt-10">
        {t("waitlist.note")}
      </p>
    </motion.div>
  );
};

export default Waitlist;
