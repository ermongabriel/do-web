import Pricing from "@/components/marketing/pricing"
import { Seo } from "@/components/Seo"
import { useLocale } from "@/locale"

const PricingPage = () => {
  const { t } = useLocale()
  return (
    <>
      <Seo
        title="Pricing"
        description={t("pricing.description")}
        path="/pricing"
      />
      <Pricing />
    </>
  )
}

export default PricingPage
