import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/locale";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { shadowButton } from "@/lib/utils";

const About = () => {
  const { t } = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = "About — Do";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = t("about.stats") as { value: string; label: string }[];
  const socials = t("about.founderSocial") as { name: string; href: string }[];

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 lg:py-32">
      <Seo
        title="About"
        description={t("about.intro")}
        path="/about"
      />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-4xl">
          <span className="inline-flex items-center gap-3 font-mono text-sm text-muted-foreground mb-6">
            <span className="h-px w-8 bg-foreground/30" />
            {t("about.eyebrow")}
          </span>
          <h1
            className={`font-display text-4xl leading-[0.95] tracking-tight transition-all duration-1000 lg:text-7xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {t("about.titleLine1")}
            <br />
            <span className="text-muted-foreground">{t("about.titleLine2")}</span>
          </h1>
          <p
            className={`mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground transition-all delay-200 duration-700 lg:text-xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {t("about.intro")}
          </p>
        </div>

        {/* Founder — first */}
        <div className="mt-24 grid items-center gap-12 lg:grid-cols-[320px_1fr] lg:gap-20">
          {/* Portrait */}
          <div className="mx-auto w-full max-w-[320px] lg:mx-0">
            <div className="relative">
              <div className="absolute -bottom-3 -right-3 h-full w-full border-2 border-solid border-foreground" />
              <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-solid border-foreground bg-foreground/[0.03]">
                <img
                  src="/founder.jpeg"
                  alt={t("about.founderName")}
                  onError={(e) => {
                    const img = e.currentTarget
                    img.style.display = "none"
                    const fallback = img.nextElementSibling as HTMLElement | null
                    if (fallback) fallback.style.display = "flex"
                  }}
                  className="h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0 hidden items-center justify-center bg-gradient-primary text-primary-foreground"
                  aria-hidden="true"
                >
                  <span className="font-display text-7xl tracking-tight">
                    {t("about.founderName")
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="font-display text-2xl tracking-tight">
                {t("about.founderName")}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t("about.founderRole")}
              </div>
              {/* Social links */}
              <div className="mt-4 flex flex-wrap gap-4">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s.name}
                    <ArrowUpRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quote + bio */}
          <div>
            <span className="inline-flex items-center gap-3 font-mono text-sm text-muted-foreground mb-6">
              <span className="h-px w-8 bg-foreground/30" />
              {t("about.founderEyebrow")}
            </span>
            <blockquote className="font-display text-2xl leading-snug tracking-tight lg:text-3xl">
              “{t("about.founderQuote")}”
            </blockquote>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
              {t("about.founderBio")}
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-24 grid grid-cols-2 gap-px border border-foreground/10 bg-foreground/10 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.value}
              className={`bg-background p-8 transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="font-display text-3xl tracking-tight lg:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="font-display text-3xl tracking-tight lg:text-4xl">
              {t("about.missionTitle")}
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-muted-foreground lg:text-xl">
              {t("about.mission")}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-24">
          <h2 className="mb-10 font-display text-3xl tracking-tight lg:text-4xl">
            {t("about.valuesTitle")}
          </h2>
          <div className="grid grid-cols-1 gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
            {(t("testimonial.values") as string[]).map((value, i) => (
              <div
                key={value}
                className="bg-background p-8 text-lg font-medium transition-colors hover:bg-foreground/[0.02]"
              >
                <span className="mr-3 font-mono text-sm text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {value}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 border border-foreground p-8 transition-all duration-1000 lg:p-16">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-display text-2xl tracking-tight lg:text-4xl">
                {t("about.teamTitle")}
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">{t("about.teamBody")}</p>
            </div>
            <Link to="/contact" className="shrink-0">
              <button className={`group flex items-center gap-2 rounded-none border-2 border-solid border-foreground bg-gradient-primary px-8 py-4 text-sm font-medium text-primary-foreground ${shadowButton}`}>
                {t("footer.linkContact")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
