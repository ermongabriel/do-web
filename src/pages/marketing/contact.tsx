import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/locale";
import { ArrowRight, Mail, Megaphone, MapPin } from "lucide-react";
import { Seo } from "@/components/Seo";
import { shadowButton, shadowInput } from "@/lib/utils";

const Contact = () => {
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = "Contact — Do";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSent(true);
  };

  const channels = [
    { icon: Mail, label: t("contact.emailLabel"), value: t("contact.email"), href: "mailto:hello@do.app" },
    { icon: Megaphone, label: t("contact.press"), value: t("contact.press"), href: "mailto:press@do.app" },
    { icon: MapPin, label: t("contact.directTitle"), value: t("contact.location"), href: "#" },
  ];

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <Seo
        title="Contact"
        description={t("contact.intro")}
        path="/contact"
      />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-3 font-mono text-sm text-muted-foreground mb-6">
            <span className="h-px w-8 bg-foreground/30" />
            {t("contact.eyebrow")}
          </span>
          <h1 className="font-display text-4xl leading-[0.95] tracking-tight lg:text-7xl">
            {t("contact.titleLine1")}
            <br />
            <span className="text-muted-foreground">{t("contact.titleLine2")}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
            {t("contact.intro")}
          </p>
        </div>

        <div className="mt-20 grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    {t("contact.emailLabel")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("contact.emailPlaceholder")}
                    required
                    className={`w-full border-2 border-solid border-foreground px-5 py-4 ${shadowInput}`}
                    style={{ boxShadow: "4px 4px 0px 0px var(--foreground)" }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    {t("contact.messageLabel")}
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("contact.messagePlaceholder")}
                    required
                    rows={6}
                    className={`w-full resize-none border-2 border-solid border-foreground px-5 py-4 ${shadowInput}`}
                    style={{ boxShadow: "4px 4px 0px 0px var(--foreground)" }}
                  />
                </div>

                <button
                  type="submit"
                  className={`group flex w-full items-center justify-center gap-2 rounded-none border-2 border-solid border-foreground bg-gradient-primary px-8 py-4 text-sm font-medium text-primary-foreground ${shadowButton} sm:w-auto`}
                >
                  {t("contact.submit")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="text-xs text-muted-foreground/70 font-mono">{t("contact.note")}</p>
              </form>
            ) : (
              <div className="border-2 border-solid border-foreground p-10 text-center" style={{ boxShadow: "4px 4px 0px 0px var(--foreground)" }}>
                <h2 className="font-display text-2xl tracking-tight">{t("waitlist.successTitle")}</h2>
                <p className="mt-3 text-muted-foreground">{t("waitlist.successDescription")}</p>
              </div>
            )}
          </motion.div>

          {/* Direct channels */}
          <div>
            <h2 className="mb-8 font-display text-2xl tracking-tight lg:text-3xl">
              {t("contact.directTitle")}
            </h2>
            <div className="space-y-px border border-foreground/10 bg-foreground/10">
              {channels.map((c) => {
                const Icon = c.icon;
                const Wrapper = c.href.startsWith("#") ? "div" : "a";
                return (
                  <Wrapper
                    key={c.label}
                    href={c.href.startsWith("#") ? undefined : c.href}
                    className="flex items-center gap-5 bg-background p-6 transition-colors hover:bg-foreground/[0.02]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-foreground/10">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {c.label}
                      </div>
                      <div className="mt-1 text-lg font-medium">{c.value}</div>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
