import { useEffect, useRef } from "react";
import { useLocale } from "@/locale";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Lock, Eye } from "lucide-react";
import { Seo } from "@/components/Seo";
import { shadowButton } from "@/lib/utils";

function AvatarTutorPreview() {
  const { t } = useLocale()
  return (
    <div className="relative flex aspect-square w-full max-w-[420px] items-center justify-center overflow-hidden border border-foreground/10 bg-foreground/[0.02]">
      <div className="absolute top-0 right-0 left-0 flex items-center justify-between border-b border-foreground/10 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <div className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {t("cta.previewLabel")}
        </span>
      </div>
      <div className="relative flex items-center justify-center">
        <span className="bg-gradient-primary absolute h-40 w-40 animate-ping rounded-full opacity-20 [animation-duration:3s]" />
        <span className="bg-gradient-primary absolute h-28 w-28 animate-ping rounded-full opacity-30 [animation-delay:0.5s] [animation-duration:3s]" />
        <span className="bg-gradient-primary relative h-20 w-20 rounded-full shadow-lg" />
      </div>
      <div className="absolute right-0 bottom-6 left-0 px-6 text-center">
        <p className="text-sm font-medium text-foreground">{t("cta.previewTitle")}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("cta.previewDescription")}</p>
      </div>
    </div>
  )
}

const AiTutor = () => {
  const { t } = useLocale()
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = "AI Tutor — Do";
  }, []);

  const steps = t("aiTutor.steps") as { number: string; title: string; description: string }[];
  const safety = t("aiTutor.safety") as { title: string; description: string }[];
  const safetyIcons = [ShieldCheck, Lock, Eye];

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-24 lg:py-32">
      <Seo
        title="AI Tutor"
        description={t("aiTutor.intro")}
        path="/ai-tutor"
      />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Hero */}
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="flex-1">
            <span className="inline-flex items-center gap-3 font-mono text-sm text-muted-foreground mb-6">
              <span className="h-px w-8 bg-foreground/30" />
              {t("aiTutor.eyebrow")}
            </span>
            <h1 className="font-display text-4xl leading-[0.95] tracking-tight lg:text-6xl">
              {t("aiTutor.titleLine1")}
              <br />
              <span className="text-muted-foreground">{t("aiTutor.titleLine2")}</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground lg:text-xl">
              {t("aiTutor.intro")}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/auth/waitlist">
                <button className={`group flex w-full items-center justify-center gap-2 rounded-none border-2 border-solid border-foreground bg-gradient-primary px-8 py-4 text-sm font-medium text-primary-foreground ${shadowButton} sm:w-auto`}>
                  {t("nav.joinWaitlist")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
              <Link to="/pricing">
                <button className={`rounded-none border-2 border-solid border-foreground px-8 py-4 text-sm font-medium text-foreground ${shadowButton}`}>
                  {t("nav.pricing")}
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full max-w-[420px]">
            <AvatarTutorPreview />
          </div>
        </div>

        {/* How it works */}
        <div className="mt-28">
          <h2 className="mb-12 font-display text-3xl tracking-tight lg:text-4xl">
            {t("aiTutor.howTitle")}
          </h2>
          <div className="grid gap-px border border-foreground/10 bg-foreground/10 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="bg-background p-8">
                <div className="mb-6 font-display text-3xl text-foreground/30">{step.number}</div>
                <h3 className="mb-3 font-display text-xl tracking-tight">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety */}
        <div className="mt-28 grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <h2 className="font-display text-3xl tracking-tight lg:text-4xl">
              {t("aiTutor.safetyTitle")}
            </h2>
          </div>
          <div className="space-y-6">
            {safety.map((item, i) => {
              const Icon = safetyIcons[i % safetyIcons.length];
              return (
                <div key={item.title} className="flex items-start gap-4 border border-foreground/10 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-foreground/10">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-28 border border-foreground p-8 transition-all duration-1000 lg:p-16">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-display text-2xl tracking-tight lg:text-4xl">{t("aiTutor.ctaTitle")}</h2>
              <p className="mt-4 max-w-xl text-muted-foreground">{t("aiTutor.ctaBody")}</p>
            </div>
            <Link to="/auth/waitlist" className="shrink-0">
              <button className={`group flex items-center gap-2 rounded-none border-2 border-solid border-foreground bg-gradient-primary px-8 py-4 text-sm font-medium text-primary-foreground ${shadowButton}`}>
                {t("nav.joinWaitlist")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiTutor;
