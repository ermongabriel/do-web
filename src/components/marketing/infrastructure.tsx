"use client";

import { useEffect, useState, useRef } from "react";
import { useLocale } from "@/locale";

// What actually syncs offline vs. what needs a live connection — this is
// real product behavior, not a marketing stat. Keep this list accurate
// as the actual sync capabilities evolve.
const syncItems = [
  { feature: "Announcements", detail: "School & class updates", status: "Offline-ready", offlineReady: true },
  { feature: "Class Content", detail: "Docs, audio, video", status: "Offline-ready", offlineReady: true },
  { feature: "Polls", detail: "Comprehension checks", status: "Offline-ready", offlineReady: true },
  { feature: "AI Tutor Calls", detail: "Live avatar sessions", status: "Requires connection", offlineReady: false },
];

const Infrastructure = () => {
  const { t } = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const localizedSyncItems = t("infrastructure.syncItems", syncItems);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % syncItems.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
              <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
                <span className="w-8 h-px bg-foreground/30" />
              {t("infrastructure.eyebrow")}
              </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              {t("infrastructure.titleLine1")}
              <br />
              {t("infrastructure.titleLine2")}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              {t("infrastructure.description")}
            </p>

            {/* Stats — real behavior, not fabricated infra numbers */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">{t("infrastructure.stats.offline")}</div>
                <div className="text-sm text-muted-foreground">{t("infrastructure.stats.offlineSub")}</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">{t("infrastructure.stats.auto")}</div>
                <div className="text-sm text-muted-foreground">{t("infrastructure.stats.autoSub")}</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">{t("infrastructure.stats.zero")}</div>
                <div className="text-sm text-muted-foreground">{t("infrastructure.stats.zeroSub")}</div>
              </div>
            </div>
          </div>

          {/* Right: Sync status list */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10">
              {/* Header */}
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">{t("infrastructure.syncStatus")}</span>
                <span className="flex items-center gap-2 text-xs font-mono text-gradient-primary">
                  <span className="w-2 h-2 rounded-full bg-gradient-primary animate-pulse" />
                  {t("infrastructure.syncing")}
                </span>
              </div>

              {/* Items */}
              <div>
                {localizedSyncItems.map((item, index) => {
                  const isOfflineReady = item.offlineReady;
                  return (
                    <div
                      key={item.feature}
                      className={`px-6 py-5 border-b border-foreground/5 last:border-b-0 flex items-center justify-between transition-all duration-300 ${
                        activeItem === index ? "bg-foreground/[0.02]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                            activeItem === index
                              ? isOfflineReady
                                ? "bg-gradient-primary"
                                : "bg-foreground/40"
                              : "bg-foreground/20"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{item.feature}</div>
                          <div className="text-sm text-muted-foreground">{item.detail}</div>
                        </div>
                      </div>
                      <span
                        className={`font-mono text-xs px-2 py-1 rounded whitespace-nowrap ${
                          isOfflineReady
                            ? "text-gradient-primary"
                            : "text-muted-foreground bg-foreground/5"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Infrastructure;
