import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLocale } from "@/locale"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { AnimatedSphere } from "./animated-sphere"
import { Link } from "react-router-dom"
import { shadowButton } from "@/lib/utils"

const Hero = () => {
  const [wordIndex, setWordIndex] = useState(0)
  const { t } = useLocale()
  const words = [
    t("hero.word1"),
    t("hero.word2"),
    t("hero.word3"),
    t("hero.word4"),
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden">
      {/* Animated sphere background */}
      <div className="pointer-events-none absolute top-1/2 right-0 hidden h-[600px] w-[600px] -translate-y-1/2 opacity-40 lg:block lg:h-[800px] lg:w-[800px]">
        <AnimatedSphere />
      </div>

      {/* Subtle grid lines */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/10"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-[1200px] px-6 py-20 md:px-8 md:py-28 lg:px-12 lg:py-40"
      >
        {/* Eyebrow */}
        <div
          className="mb-6 transition-all duration-700 md:mb-8 translate-y-0 opacity-100"
        >
          <span className="inline-flex items-center gap-3 font-mono text-sm text-muted-foreground">
            <span className="h-px w-8 bg-foreground/30" />
            {t("hero.eyebrow")}
          </span>
        </div>

        {/* Main headline */}
        <div className="mb-10 md:mb-12">
          <h1
            className={`font-display text-[clamp(3rem,12vw,10rem)] leading-[0.9] tracking-tight transition-all duration-1000 translate-y-0 opacity-100 text-center lg:text-left`}
          >
            <span className="block">{t("hero.titlePart1")}</span>
            <span className="block">
              {t("hero.titleTo")}{" "}
              <span className="relative inline-block">
                <span key={wordIndex} className="inline-flex">
                  {words[wordIndex].split("").map((char, i) => (
                    <span
                      key={`${wordIndex}-${i}`}
                      className="animate-char-in inline-block"
                      style={{
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="absolute right-0 -bottom-2 left-0 h-3 bg-foreground/10" />
              </span>
            </span>
          </h1>
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-24">
          <p
            className={`text-base leading-relaxed text-muted-foreground transition-all delay-200 duration-700 md:text-lg lg:text-xl translate-y-0 opacity-100 mx-auto max-w-none text-center lg:mx-0 lg:max-w-xl lg:text-left`}
          >
            {t("hero.description")}
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col items-center justify-center gap-4 transition-all delay-300 duration-700 sm:flex-row sm:items-start sm:justify-start translate-y-0 opacity-100`}
          >
            <Link to="/auth/waitlist">
                <Button
                  size="lg"
                  className={`bg-gradient-primary h-14 w-full rounded-none border-2 border-solid border-foreground px-8 text-primary-foreground ${shadowButton} sm:w-auto`}
                >
                {t("hero.joinWaitlist")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
              <Button
                size="lg"
                variant="outline"
                className={`h-14 w-full rounded-none border-2 border-solid border-foreground px-8 text-base ${shadowButton} sm:w-auto`}
              >
              {t("hero.seeHowItWorks")}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats marquee - full width outside container */}
      {/* Left commented out intentionally: these were placeholder example stats
          (Netflix/Stripe/Linear/Notion) from the original template and are not
          real Do metrics. Replace with genuine numbers (e.g. pilot schools,
          students reached, uptime) once you have them, then uncomment. */}
      {/* <div 
        className={`absolute bottom-15 left-0 right-0 transition-all duration-700 delay-500 ${
          true ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex gap-16 marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-16">
              {[
                { value: "20 days", label: "saved on builds", company: "NETFLIX" },
                { value: "98%", label: "faster deployment", company: "STRIPE" },
                { value: "300%", label: "throughput increase", company: "LINEAR" },
                { value: "6x", label: "faster to ship", company: "NOTION" },
              ].map((stat) => (
                <div key={`${stat.company}-${i}`} className="flex items-baseline gap-4">
                  <span className="text-4xl lg:text-5xl font-display">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                    <span className="block font-mono text-xs mt-1">{stat.company}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div> */}

      {/* Scroll indicator */}
    </section>
  )
}

export default Hero
