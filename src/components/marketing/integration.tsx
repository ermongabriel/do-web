"use client";

import { useEffect, useState, useRef } from "react";
import { useLocale } from "@/locale";

// These are the integrations actually planned for Do, based on what
// schools already use day to day — not a padded generic dev-tool list.
// None of these are live yet; update the `status` as each one actually ships.
const integrations = [
  { name: "Google Workspace", category: "Sign in & Drive import", status: "Planned" },
  { name: "Microsoft 365", category: "Sign in & Outlook", status: "Planned" },
  { name: "Flutterwave", category: "Mobile money & card payments", status: "Planned" },
  { name: "Paystack", category: "Mobile money & card payments", status: "Planned" },
  { name: "Google Calendar", category: "Schedule sync", status: "Planned" },
  { name: "Bank Transfer", category: "Invoiced billing", status: "Planned" },
];

const Integrations = () => {
  const { t } = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const localizedIntegrations = t("integration.items", integrations);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="integrations" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 lg:mb-24 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            {t("integration.eyebrow")}
            <span className="w-8 h-px bg-foreground/30" />
          </span>
          <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-6">
            {t("integration.titleLine1")}
            <br />
            {t("integration.titleLine2")}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t("integration.description")}
          </p>
          <p className="text-sm text-muted-foreground/70 mt-4 font-mono">
            {t("integration.note")}
          </p>
        </div>

      </div>
      
      {/* Full-width marquees outside container */}
      <div className="w-full mb-6">
        <div className="flex gap-6 marquee">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-6 shrink-0">
              {localizedIntegrations.map((integration) => (
                <div
                  key={`${integration.name}-${setIndex}`}
                  className="shrink-0 px-8 py-6 border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/[0.02] transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-lg font-medium group-hover:translate-x-1 transition-transform">
                      {integration.name}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground/60 border border-foreground/10 rounded px-1.5 py-0.5 shrink-0">
                      {integration.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">{integration.category}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      {/* Reverse marquee */}
      <div className="w-full">
        <div className="flex gap-6 marquee-reverse">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-6 shrink-0">
              {[...localizedIntegrations].reverse().map((integration) => (
                <div
                  key={`${integration.name}-reverse-${setIndex}`}
                  className="shrink-0 px-8 py-6 border border-foreground/10 hover:border-foreground/30 hover:bg-foreground/[0.02] transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-lg font-medium group-hover:translate-x-1 transition-transform">
                      {integration.name}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground/60 border border-foreground/10 rounded px-1.5 py-0.5 shrink-0">
                      {integration.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">{integration.category}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Integrations;
