import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import AnimatedWave from "./animated-wave"
import { useLocale } from "@/locale"

// Dropped the "Developers" column entirely — it linked to a public SDK
// and API reference that don't exist. Consolidated into three real columns.
const footerLinks = {
  Product: [
    { name: "Features", href: "/#features" },
    { name: "How it works", href: "/#how-it-works" },
    { name: "AI Tutor", href: "/ai-tutor" },
    { name: "Pricing", href: "/#pricing" },
    { name: "Integrations", href: "/#integrations" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  Legal: [
    { name: "Privacy", href: "/legal/privacy" },
    { name: "Terms", href: "/legal/terms" },
    { name: "Security & Trust", href: "/legal/security" },
  ],
}

// Matches your actual social presence from the launch kit.
const socialLinks = [
  { name: "X / Twitter", href: "#" },
  { name: "LinkedIn", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "Facebook", href: "#" },
]

const LOGO_IMAGE_SRC = "/logo.png"

const linkKeyMap: Record<string, string> = {
  Features: "linkFeatures",
  "How it works": "linkHowItWorks",
  "AI Tutor": "linkAiTutor",
  Pricing: "linkPricing",
  Integrations: "linkIntegrations",
  About: "linkAbout",
  Contact: "linkContact",
  Privacy: "linkPrivacy",
  Terms: "linkTerms",
  "Security & Trust": "linkSecurityTrust",
}

// Renders an internal route with <Link> (client-side nav) and everything
// else (on-page anchors, external) as a plain <a>.
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link
        to={href}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    )
  }
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </a>
  )
}

const Footer = () => {
  const { t } = useLocale();
  return (
    <footer className="relative border-t border-foreground/10">
      {/* Animated wave background */}
      <div className="pointer-events-none absolute inset-0 h-64 overflow-hidden opacity-20">
        <AnimatedWave />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-5 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link to="/" className="group flex shrink-0 items-center gap-2">
                <img
                  src={LOGO_IMAGE_SRC}
                  alt="Do"
                  className="h-9 w-auto max-w-[140px]"
                />
              </Link>

              <p className="mb-8 mt-6 max-w-xs leading-relaxed text-muted-foreground">
                {t("footer.description")}
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => {
              const colKey =
                title === "Product" ? "colProduct" : title === "Company" ? "colCompany" : "colLegal";
              return (
                <div key={title}>
                  <h3 className="mb-6 text-sm font-medium">{t(`footer.${colKey}`)}</h3>
                  <ul className="space-y-4">
                    {links.map((link) => (
                      <li key={link.name}>
                        <FooterLink href={link.href}>
                          {t(`footer.${linkKeyMap[link.name] ?? link.name}`)}
                        </FooterLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-foreground/10 py-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright")}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-foreground/40" />
              {t("footer.status")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
