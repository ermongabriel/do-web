import Feature from "@/components/marketing/feature"
import Hero from "@/components/marketing/hero"
import HowItWork from "@/components/marketing/howItWork"
import Infrastructure from "@/components/marketing/infrastructure"
import Metrics from "@/components/marketing/metrics"
import Integrations from "@/components/marketing/integration"
import Security from "@/components/marketing/security"
import Developer from "@/components/marketing/developer"
import Testimonial from "@/components/marketing/testimonial"
import Pricing from "@/components/marketing/pricing"
import Cta from "@/components/marketing/cta"
import { Seo } from "@/components/Seo"
// import { Button } from "@/components/ui/button"

const Landing = () => {
  return (
    <>
      <Seo
        title="Structured institutional communication, offline-first"
        description="Do replaces scattered WhatsApp groups with one structured, offline-first space for institutional communication — content, polls, and a consent-based AI tutor for every trainer."
        path="/"
      />
      {/* <Cursor /> */}
      {/* <div>Landing</div>
      <Button className="bg-gradient-primary mt-2 rounded-none border-2 border-solid border-foreground text-primary-foreground shadow-[3px_3px_0px_0px_var(--foreground)] transition-all duration-100 ease-linear hover:scale-[1.06] active:scale-[0.96] active:shadow-[3px_3px_0px_0px_var(--foreground)]">
        Button
      </Button> */}
      <Hero />
      <Feature />
      <HowItWork />
      <Infrastructure />
      <Metrics />
      <Integrations />
      <Security />
      <Developer />
      <Testimonial />
      <Pricing />
      <Cta />
    </>
  )
}

export default Landing
