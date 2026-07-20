import { useState, useEffect, useRef } from "react";
import { useLocale } from "@/locale";

// This section originally showcased a public SDK ("npm install...").
// Do doesn't have (or need) a public developer SDK — its users are
// institutions, trainers, and learners, not third-party integrators. Rather
// than invent fake install commands, this is repointed at a real
// audience Do does have: the institution IT lead / procurement officer who
// needs real answers before signing off, not marketing copy.
const trustTopics = [
  {
    id: "ownership",
    label: "Data Ownership",
    content: `Your institution's data belongs to your institution.

- Full export available anytime, in
  standard formats
- No lock-in: leaving Do means
  taking your data with you
- Deleted data is actually deleted,
  not just hidden`,
  },
  {
    id: "consent",
    label: "Consent & AI",
    content: `Every AI avatar interaction is
disclosed and logged.

- Trainers opt in explicitly before
  any avatar or voice is created
- Learners are told they're talking
  to an AI, every session
- Full transcripts available for
  trainer and admin review`,
  },
  {
    id: "security",
    label: "Security",
    content: `Built with standard safeguards
from day one, not bolted on later.

- TLS encryption in transit
- Role-based access control per
  institution (admin/trainer/learner)
- Per-institution data isolation in a
  multi-tenant setup`,
  },
];

const trustPoints = [
  {
    id: "data",
    title: "Data stays yours",
    description: "Full export anytime. No lock-in.",
  },
  {
    id: "consent",
    title: "Consent-logged AI",
    description: "Every avatar interaction disclosed and recorded.",
  },
  {
    id: "transit",
    title: "Encrypted in transit",
    description: "TLS everywhere, role-based access.",
  },
  {
    id: "scale",
    title: "Built for scale",
    description: "Isolated data between institutions, by design.",
  },
];

const revealAnimationStyles = `
  .dev-code-line {
    opacity: 0;
    transform: translateX(-8px);
    animation: devLineReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  
  @keyframes devLineReveal {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  .dev-code-char {
    opacity: 0;
    filter: blur(8px);
    animation: devCharReveal 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  
  @keyframes devCharReveal {
    to {
      opacity: 1;
      filter: blur(0);
    }
  }
`;

const Developer = () => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
    <section id="trust" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: revealAnimationStyles }} />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              {t("developer.eyebrow")}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display tracking-tight mb-6 lg:mb-8">
              {t("developer.titleLine1")}
              <br />
              <span className="text-muted-foreground">{t("developer.titleLine2")}</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 lg:mb-12 leading-relaxed">
              {t("developer.description")}
            </p>
            
            {/* Trust points */}
            <div className="grid grid-cols-2 gap-6">
              {trustPoints.map((point, index) => (
                <div
                  key={point.title}
                  className={`transition-all duration-500 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${index * 50 + 200}ms` }}
                >
                <h3 className="font-medium mb-1">{t(`developer.points.${point.id}.title`, point.title)}</h3>
                <p className="text-sm text-muted-foreground">{t(`developer.points.${point.id}.description`, point.description)}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Info panel */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 lg:translate-x-8"
            } lg:sticky lg:top-32`}
          >
            <div className="border border-foreground/10">
               {/* Tabs */}
               <div className="flex items-center overflow-x-auto border-b border-foreground/10">
                 {trustTopics.map((topic, idx) => (
                   <button
                     key={topic.label}
                     type="button"
                     onClick={() => setActiveTab(idx)}
                     className={`shrink-0 px-3 py-3 text-xs font-mono transition-colors relative sm:px-6 sm:py-4 sm:text-sm ${
                       activeTab === idx
                         ? "text-foreground"
                         : "text-muted-foreground hover:text-foreground"
                     }`}
                   >
                      {t(`developer.topics.${topic.id}.label`, topic.label)}
                    {activeTab === idx && (
                      <span className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />
                    )}
                  </button>
                ))}
              </div>
              
               {/* Content */}
               <div className="p-5 font-mono text-xs break-words bg-foreground/[0.01] min-h-[200px] sm:p-8 sm:text-sm sm:min-h-[220px]">
                 <pre className="text-foreground/80 whitespace-pre-wrap break-words">
                   {t(`developer.topics.${trustTopics[activeTab].id}.content`, trustTopics[activeTab].content).split('\n').map((line, lineIndex) => (
                     <div 
                       key={`${activeTab}-${lineIndex}`} 
                       className="leading-loose dev-code-line"
                       style={{ animationDelay: `${lineIndex * 80}ms` }}
                     >
                       <span className="inline-flex flex-wrap">
                         {line.split('').map((char, charIndex) => (
                           <span
                             key={`${activeTab}-${lineIndex}-${charIndex}`}
                             className="dev-code-char"
                             style={{
                               animationDelay: `${lineIndex * 80 + charIndex * 15}ms`,
                             }}
                           >
                             {char === ' ' ? '\u00A0' : char}
                           </span>
                         ))}
                       </span>
                     </div>
                   ))}
                 </pre>
               </div>
             </div>
             
             {/* Links */}
             <div className="mt-6 flex flex-wrap items-center gap-4 text-sm sm:gap-6">
               <a href="#" className="text-foreground hover:underline underline-offset-4">
                 {t("developer.readSecurity")}
               </a>
               <span className="text-foreground/20">|</span>
               <a href="#" className="text-muted-foreground hover:text-foreground">
                 {t("developer.requestDpa")}
               </a>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}

export default Developer;