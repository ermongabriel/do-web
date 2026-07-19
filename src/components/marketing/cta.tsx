import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLocale } from "@/locale"
import { Link } from "react-router-dom"
import { shadowButton } from "@/lib/utils"

// Small, self-contained illustration for the AI Avatar Tutor — built inline
// rather than depending on the unbuilt `AnimatedTetrahedron` component that
// was referenced (but never implemented) in the original file. Uses
// Tailwind's built-in `animate-ping` for the expanding rings, so no custom
// keyframes are needed. Swap for a real product screenshot/video once one
// exists — this is intentionally a placeholder that still looks finished.
function AvatarTutorPreview() {
  const { t } = useLocale()

  return (
    <div className="relative flex aspect-square w-full max-w-[420px] items-center justify-center overflow-hidden border border-foreground/10 bg-foreground/[0.02]">
      {/* Window chrome, consistent with the "do — preview" panels elsewhere on the site */}
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

      {/* Pulsing avatar orb */}
      <div className="relative flex items-center justify-center">
        <span className="bg-gradient-primary absolute h-40 w-40 animate-ping rounded-full opacity-20 [animation-duration:3s]" />
        <span className="bg-gradient-primary absolute h-28 w-28 animate-ping rounded-full opacity-30 [animation-delay:0.5s] [animation-duration:3s]" />
        <span className="bg-gradient-primary relative h-20 w-20 rounded-full shadow-lg" />
      </div>

      {/* Caption */}
      <div className="absolute right-0 bottom-6 left-0 px-6 text-center">
        <p className="text-sm font-medium text-foreground">
          {t("cta.previewTitle")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("cta.previewDescription")}
        </p>
      </div>
    </div>
  )
}

// Reuses the shared hard-shadow treatment (shadowButton) from lib/utils.
const Cta = () => {
  const { t } = useLocale()
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div
          className={`relative border border-foreground transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight effect */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10 transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.15), transparent 40%)`,
            }}
          />

          <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-24">
            <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
              {/* Left content */}
              <div className="flex-1">
                <h2 className="font-display mb-8 text-4xl leading-[0.95] tracking-tight lg:text-7xl">
                  {t("cta.titleLine1")}
                  <br />
                  {t("cta.titleLine2")}
                </h2>

                <p className="mb-12 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
                  {t("cta.description")}
                </p>
                <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                  <Link to="/auth/waitlist" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className={`bg-gradient-primary group h-14 w-full px-8 text-base text-primary-foreground ${shadowButton} sm:w-auto`}
                    >
                      {t("cta.primary")}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                    <Button
                      size="lg"
                      variant="outline"
                      className={`h-14 w-full bg-background px-8 text-base text-foreground ${shadowButton} sm:w-auto`}
                    >
                    {t("cta.secondary")}
                  </Button>
                </div>

                <p className="mt-8 font-mono text-sm text-muted-foreground">
                  {t("cta.note")}
                </p>
              </div>

              {/* Right: AI tutor illustration */}
              <div className="order-first w-full items-center justify-center lg:order-none lg:-mr-16 lg:flex">
                <AvatarTutorPreview />
              </div>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="absolute top-0 right-0 h-32 w-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 h-32 w-32 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  )
}

export default Cta
