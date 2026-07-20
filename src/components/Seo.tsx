import { Helmet } from "react-helmet-async"
import { useLocale } from "@/locale"

const SITE_NAME = "Do"
const SITE_URL = "https://do.app"
const DEFAULT_TITLE = "Do | Structured institutional communication"
const DEFAULT_DESCRIPTION =
  "Do replaces scattered WhatsApp groups with one structured, offline-first space for institutional communication — content, polls, and a consent-based AI tutor for every trainer."

type SeoProps = {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: "website" | "article"
  noindex?: boolean
}

// Centralised, per-route SEO. Sets title, canonical, description, and the
// Open Graph / Twitter / hreflang (EN + FR) tags so every public route is
// independently indexable and shares clean social previews.
export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = "/icon-512.png",
  type = "website",
  noindex = false,
}: SeoProps) {
  const { locale } = useLocale()
  const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE
  const canonical = `${SITE_URL}${path}`
  const ogImage = image.startsWith("http") ? image : `${SITE_URL}${image}`

  const locales: { code: string; href: string }[] = [
    { code: "en", href: `${SITE_URL}${path}` },
    { code: "fr", href: `${SITE_URL}/fr${path}` },
  ]

  return (
    <Helmet
      htmlAttributes={{ lang: locale === "fr" ? "fr" : "en" }}
      title={fullTitle}
      defaultTitle={DEFAULT_TITLE}
    >
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex" />}
      {!noindex && <meta name="robots" content="index, follow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={locale === "fr" ? "fr_FR" : "en_US"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* hreflang alternates for bilingual SEO */}
      {locales.map((l) => (
        <link
          key={l.code}
          rel="alternate"
          hrefLang={l.code}
          href={l.href}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${path}`} />
    </Helmet>
  )
}

export { SITE_NAME, SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION }
