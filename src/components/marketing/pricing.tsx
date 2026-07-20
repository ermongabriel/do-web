import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { useLocale } from "@/locale"
import { Link } from "react-router-dom"
import { shadowButton } from "@/lib/utils"

// Base prices are in XAF (FCFA) — that's the real, primary currency from
// the Subscription & Pricing Strategy doc. Everything else is converted
// from this single source of truth rather than maintaining separate price
// lists per currency, so the numbers can't quietly drift apart.
const plans = [
  {
    name: "Free",
    description: "A single cohort or very small institution",
    audience: "pricing.audience.free",
    priceXaf: { monthly: 0, annual: 0 },
    features: [
      "Up to 20 learners",
      "Announcements & content",
      "Offline-first sync",
      "Instant polls & feedback",
      "No AI avatar minutes",
    ],
    cta: "Get started free",
    popular: false,
  },
  {
    name: "Basic",
    description: "Replace WhatsApp chaos institution-wide",
    audience: "pricing.audience.basic",
    priceXaf: { monthly: 20000, annual: 16700 },
    features: [
      "Unlimited learners & trainers",
      "Offline-first sync",
      "Instant polls & feedback",
      "AI content summarization",
      "No AI avatar minutes",
    ],
    cta: "Join waitlist",
    popular: false,
  },
  {
    name: "Standard",
    description: "Ready to pilot the AI Avatar Tutor",
    audience: "pricing.audience.standard",
    priceXaf: { monthly: 85000, annual: 70800 },
    features: [
      "Everything in Basic",
      "300 AI avatar minutes / month",
      "Semantic search across content",
      "Class comprehension analytics",
      "Shared minute pool, institution-wide",
    ],
    cta: "Join waitlist",
    popular: true,
  },
  {
    name: "Premium",
    description: "Larger institutions, heavy avatar use",
    audience: "pricing.audience.premium",
    priceXaf: { monthly: 200000, annual: 166700 },
    features: [
      "Everything in Standard",
      "1,000 AI avatar minutes / month",
      "Group \"office hours\" sessions",
      "Priority support",
      "Minute rollover (annual plans)",
    ],
    cta: "Talk to us",
    popular: false,
  },
]

// Static, approximate conversion rates from XAF. XAF/EUR is an actual
// fixed peg (655.957), so that one's exact — USD and GBP fluctuate and
// are rough estimates. For production, swap this for a live FX rate
// fetched periodically (e.g. cached daily), not hardcoded.
const CURRENCIES = {
  XAF: { label: "FCFA", rate: 1, symbolPosition: "suffix" as const },
  USD: { label: "$", rate: 1 / 600, symbolPosition: "prefix" as const },
  GBP: { label: "\u00A3", rate: 1 / 750, symbolPosition: "prefix" as const },
  EUR: {
    label: "\u20AC",
    rate: 1 / 655.957,
    symbolPosition: "prefix" as const,
  },
}

type CurrencyCode = keyof typeof CURRENCIES

function formatPrice(amountXaf: number, currency: CurrencyCode) {
  const { label, rate, symbolPosition } = CURRENCIES[currency]
  const converted = Math.round(amountXaf * rate)
  const formatted = converted.toLocaleString("en-US")
  return symbolPosition === "prefix"
    ? `${label}${formatted}`
    : `${formatted} ${label}`
}

// The CTA buttons reuse the shared hard-shadow treatment (shadowButton) so
// pricing stays consistent with the rest of the site's design system.
const Pricing = () => {
  const { t } = useLocale()
  const [isAnnual, setIsAnnual] = useState(true)
  const [currency, setCurrency] = useState<CurrencyCode>("XAF")
  const localizedPlans = t("pricing.plans", plans)
  // Merge static-only fields (e.g. audience) that aren't in the locale
  // payload, so the localized plan keeps the component-level metadata.
  const displayPlans = localizedPlans.map((p, i) => ({ ...plans[i], ...p }))

  return (
    <section
      id="pricing"
      className="relative border-t border-foreground/10 py-32 lg:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 max-w-3xl">
          <span className="mb-6 block font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {t("pricing.eyebrow")}
          </span>
           <h2 className="font-display mb-6 text-4xl tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            {t("pricing.titleLine1")}
            <br />
            <span className="text-stroke">{t("pricing.titleLine2")}</span>
          </h2>
          <p className="max-w-xl text-lg text-muted-foreground">
            {t("pricing.description")}
          </p>
        </div>

        {/* Controls: billing toggle + currency switcher */}
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Billing Toggle */}
          <div className="flex items-center gap-4">
            <span
              className={`text-sm transition-colors ${
                !isAnnual ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("pricing.monthly")}
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative h-7 w-14 rounded-none bg-foreground/10 p-1 transition-colors hover:bg-foreground/20"
              aria-label={t("pricing.billingToggle")}
            >
              <div
                className={`h-5 w-5 rounded-none bg-foreground transition-transform duration-300 ${
                  isAnnual ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-sm transition-colors ${
                isAnnual ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {t("pricing.annual")}
            </span>
            {isAnnual && (
              <span className="bg-gradient-primary ml-2 px-2 py-1 font-mono text-xs text-primary-foreground">
                {t("pricing.save")}
              </span>
            )}
          </div>

          {/* Currency Switcher */}
          <div className="flex w-fit flex-wrap items-center gap-1 border border-foreground/10 p-1">
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
              <button
                key={code}
                onClick={() => setCurrency(code)}
                className={`px-3 py-1.5 font-mono text-xs transition-colors ${
                  currency === code
                    ? "bg-gradient-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={currency === code}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-px bg-foreground/10 md:grid-cols-2 lg:grid-cols-4">
          {displayPlans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`relative bg-background p-8 lg:p-10 ${
                plan.popular
                  ? "border-2 border-foreground md:-my-4 md:py-12 lg:py-14"
                  : ""
              }`}
            >
              {plan.popular && (
                <span className="bg-gradient-primary absolute -top-3 left-8 px-3 py-1 font-mono text-xs tracking-widest text-primary-foreground uppercase">
                  {t("pricing.mostPopular")}
                </span>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-2 text-3xl text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <p className="mt-3 inline-block border border-foreground/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t(plan.audience)}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8 border-b border-foreground/10 pb-8">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-4xl text-foreground lg:text-5xl">
                    {formatPrice(
                      isAnnual ? plan.priceXaf.annual : plan.priceXaf.monthly,
                      currency
                    )}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t("pricing.perMonth")}
                  </span>
                </div>
                {isAnnual && plan.priceXaf.monthly > 0 && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("pricing.billedAnnually")}
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="mb-10 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA — same shadow/scale treatment as the rest of the site */}
              <Link to="/auth/waitlist">
                <button
                  className={`group flex w-full items-center justify-center gap-2 py-4 text-sm font-medium ${shadowButton} ${
                    plan.popular
                      ? "bg-gradient-primary text-primary-foreground"
                      : "bg-background text-foreground"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          {t("pricing.noteAll")}{" "}
          <a
            href="#features"
            className="underline underline-offset-4 transition-colors hover:text-foreground"
          >
            {t("pricing.compareFeatures")}
          </a>
        </p>
        <p className="mt-3 text-center font-mono text-xs text-muted-foreground/60">
          {t("pricing.disclaimer")}
        </p>
      </div>
    </section>
  )
}

export default Pricing
