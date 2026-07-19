import { useState } from "react";
import { useLocale } from "@/locale";

// The original version of this section rotated through fabricated
// testimonials — invented people, companies, and results. Do has no
// customers yet, so there's no honest version of "customer testimonials"
// right now. This is replaced with:
//   1. A real, first-person founder statement (fill in your own words below)
//   2. An honest marquee of what Do actually stands for, instead of fake
//      client logos claiming trust that doesn't exist yet.
// Once real pilot schools/teachers give real, attributable feedback,
// THAT is the point to reintroduce a testimonials section — with real
// names, real quotes, and their permission to use them.

const Testimonial = () => {
  const { t } = useLocale();
  const [showWaitlistNote] = useState(true);

  const values: string[] = (() => {
    const v = t("testimonial.values");
    return Array.isArray(v) ? v : [];
  })();

  return (
    <section className="relative py-32 lg:py-40 border-t border-foreground/10 lg:pb-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-16">
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {t("testimonial.label")}
          </span>
          <div className="flex-1 h-px bg-foreground/10" />
        </div>

        {/* Founder statement */}
        <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8">
            <blockquote>
              <p className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-foreground">
                "{t("testimonial.founderQuote")}"
              </p>
            </blockquote>

            {/* Author */}
            <div className="mt-12 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                <span className="font-display text-2xl text-foreground">
                   {t("testimonial.founderAuthor").charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">{t("testimonial.founderAuthor")}</p>
                <p className="text-muted-foreground">{t("testimonial.founderRole")}</p>
              </div>
            </div>
          </div>

          {/* Early access callout — replaces the fake "Key Result" metric */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="p-8 border border-foreground/10">
              <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase block mb-4">
                {t("testimonial.whereTitle")}
              </span>
              <p className="font-display text-2xl md:text-3xl text-foreground leading-snug">
                {t("testimonial.whereBody")}
              </p>
              {showWaitlistNote && (
                <a
                  href="#waitlist"
                  className="inline-block mt-6 text-sm text-foreground hover:underline underline-offset-4"
                >
                  {t("testimonial.joinWaitlist")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Values marquee label — replaces fake "Trusted by forward-thinking teams" */}
        <div className="mt-24 pt-12 border-t border-foreground/10">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-8 text-center">
            {t("testimonial.valuesLabel")}
          </p>
        </div>
      </div>

      {/* Full-width marquee — real principles, not fabricated client logos */}
      <div className="w-full">
        <div className="flex gap-16 items-center marquee">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex gap-16 items-center shrink-0">
              {values.map((value) => (
                <span
                  key={`${setIdx}-${value}`}
                  className="font-display text-xl md:text-2xl text-foreground/30 whitespace-nowrap hover:text-foreground transition-colors duration-300"
                >
                  {value}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonial;