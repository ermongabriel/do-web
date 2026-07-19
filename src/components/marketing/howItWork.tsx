import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/locale";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { shadowButton } from "@/lib/utils";

// Each step can optionally have a real video (videoSrc). Until you have
// footage, leave videoSrc empty/null and the panel automatically shows a
// themed animated illustration instead — so the section looks intentional
// either way. Once a video exists, just fill in videoSrc and it takes over
// automatically; no other code changes needed.
const steps = [
  {
    number: "I",
    title: "Set up your school",
    description: "Create your school's workspace and invite teachers and students. No technical setup, no IT department required.",
    illustration: "setup",
    videoSrc: "", // e.g. "/videos/step-1-setup.mp4"
  },
  {
    number: "II",
    title: "Teachers share & build their AI tutor",
    description: "Upload class content and, if you choose, record a consent-based AI tutor grounded only in your own material.",
    illustration: "tutor",
    videoSrc: "", // e.g. "/videos/step-2-tutor.mp4"
  },
  {
    number: "III",
    title: "Students learn, anytime",
    description: "Content and polls sync automatically, even offline. Students can ask the AI tutor a question whenever they need to.",
    illustration: "sync",
    videoSrc: "", // e.g. "/videos/step-3-sync.mp4"
  },
];

// --- Illustration fallbacks (used until real videos exist) -------------

function SetupIllustration() {
  const people = [0, 1, 2];
  return (
    <svg viewBox="0 0 320 200" className="w-full h-full">
      {/* Building */}
      <rect x="120" y="40" width="80" height="70" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M 110 40 L 160 15 L 210 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="150" y="75" width="20" height="35" fill="currentColor" opacity="0.15" />

      {/* People joining, one by one */}
      {people.map((i) => (
        <g key={i} transform={`translate(${90 + i * 70}, 140)`}>
          <circle r="14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.9">
            <animate attributeName="opacity" values="0;0.9" dur="0.6s" begin={`${i * 0.5}s`} fill="freeze" />
          </circle>
          <path
            d="M -5 4 L -2 9 L 5 -3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0"
          >
            <animate attributeName="opacity" values="0;1" dur="0.4s" begin={`${i * 0.5 + 0.3}s`} fill="freeze" />
          </path>
        </g>
      ))}
    </svg>
  );
}

function TutorIllustration() {
  return (
    <svg viewBox="0 0 320 200" className="w-full h-full">
      {/* Central teacher-avatar node */}
      <circle cx="160" cy="100" r="16" fill="currentColor">
        <animate attributeName="r" values="16;19;16" dur="2.4s" repeatCount="indefinite" />
      </circle>

      {/* Radiating knowledge nodes */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const radius = 65;
        return (
          <g key={i}>
            <line
              x1="160"
              y1="100"
              x2={160 + Math.cos(angle) * radius}
              y2={100 + Math.sin(angle) * radius}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
            >
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </line>
            <circle
              cx={160 + Math.cos(angle) * radius}
              cy={100 + Math.sin(angle) * radius}
              r="7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <animate attributeName="r" values="7;9;7" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

function SyncIllustration() {
  return (
    <svg viewBox="0 0 320 200" className="w-full h-full">
      {/* Device */}
      <rect x="115" y="55" width="90" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="115" y1="100" x2="205" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.3" />

      {/* Sync arrows */}
      <g transform="translate(160, 140)">
        <circle r="18" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 6">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle r="3" fill="currentColor">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </g>
    </svg>
  );
}

function StepIllustration({ type }: { type: string }) {
  switch (type) {
    case "setup":
      return <SetupIllustration />;
    case "tutor":
      return <TutorIllustration />;
    case "sync":
      return <SyncIllustration />;
    default:
      return <SetupIllustration />;
  }
}

// Shows the real video if one's been added; otherwise falls back to the
// matching themed illustration. This is the only piece that needs to
// change once footage exists — just set videoSrc on the step.
function StepMedia({ step }: { step: typeof steps[0] }) {
  if (step.videoSrc) {
    return (
      <video
        src={step.videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    <div className="w-full h-full flex items-center justify-center text-background/70 p-8">
      <StepIllustration type={step.illustration} />
    </div>
  );
}

const HowItWork = () => {
  const { t, locale, setLocale } = useLocale();
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean>(() => !!localStorage.getItem("DO-accept-cookies"));

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
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => setLocale(locale === "en" ? "fr" : "en");

  const acceptCookies = () => {
    localStorage.setItem("DO-accept-cookies", "1");
    setCookiesAccepted(true);
  };

  // Use localized steps when available, fallback to static `steps` above
  const localizedSteps: any[] = (t("howItWork.steps") as any) || steps;

  // Merge static `steps` (illustration/video metadata) with the localized
  // title/description/number so the toggle language option actually
  // translates every step.
  const displaySteps = steps.map((staticStep, i) => ({
    ...staticStep,
    ...(localizedSteps[i] || {}),
  }));

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-foreground text-background overflow-hidden"
    >
      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            currentColor 40px,
            currentColor 41px
          )`
        }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 sm:gap-6">
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-background/50 mb-6">
              <span className="w-8 h-px bg-background/30" />
              {t("howItWork.subtitle")}
            </span>
            <h2
              className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t("howItWork.titleLine1")}
              <br />
              <span className="text-background/50">{t("howItWork.titleLine2")}</span>
            </h2>
          </div>

          <div className="shrink-0 sm:mt-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 px-3 py-2 rounded-md border border-foreground/10"
              aria-label={t("howItWork.languageLabel")}
            >
              <Globe className="w-4 h-4" />
              {locale.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          {/* Steps */}
          <div className="space-y-0">
            {displaySteps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`w-full text-left py-8 border-b border-background/10 transition-all duration-500 group ${
                  activeStep === index ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <div className="flex items-start gap-6">
                  <span className="font-display text-3xl text-background/30">{step.number}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl lg:text-3xl font-display mb-3 group-hover:translate-x-2 transition-transform duration-300">
                      {step.title}
                    </h3>
                    <p className="text-background/60 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Progress indicator */}
                    {activeStep === index && (
                      <div className="mt-4 h-px bg-background/20 overflow-hidden">
                        <div 
                          className="h-full bg-background w-0"
                          style={{
                            animation: 'progress 5s linear forwards'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Media preview */}
          <div className="md:sticky md:top-32 self-start">
            <div className="border border-background/10 overflow-hidden">
              {/* Window header */}
              <div className="px-6 py-4 border-b border-background/10 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                </div>
                <span className="text-xs font-mono text-background/40">DO — preview</span>
              </div>

              {/* Media content — crossfades on step change via the `key`
                  forcing a remount, with a slowed, eased transition. */}
              <div className="relative aspect-video bg-background/[0.03] overflow-hidden">
                 <div key={activeStep} className="absolute inset-0 step-media-enter">
                   <StepMedia step={displaySteps[activeStep]} />
                 </div>
              </div>

              {/* Status bar — reflects the active step instead of a static label */}
              <div className="px-6 py-4 border-t border-background/10 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gradient-primary animate-pulse shrink-0" />
                 <span className="text-xs font-mono text-background/40 truncate">
                   {displaySteps[activeStep]?.title || steps[activeStep].title}
                 </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie acceptance floating bar */}
      {!cookiesAccepted && (
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-foreground/95 text-background px-6 py-4 rounded-2xl border-2 border-solid border-foreground ${shadowButton} max-w-[920px] w-[calc(100%-40px)] flex items-center gap-4`}>
          <p className="text-sm flex-1">{t("howItWork.cookieNotice")}</p>
          <Button
            onClick={acceptCookies}
            className={`bg-gradient-primary text-primary-foreground rounded-none border-2 border-solid border-foreground ${shadowButton}`}
          >
            {t("howItWork.acceptCookies")}
          </Button>
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }

          /* Slowed, eased crossfade + gentle scale for the media panel.
            Remounting via the key={activeStep} trick restarts this
            animation automatically every time the active step changes. */
        .step-media-enter {
          opacity: 0;
          transform: scale(1.04);
          animation: stepMediaFade 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes stepMediaFade {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}

export default HowItWork;