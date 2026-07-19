import { useLocale } from "@/locale";
import LegalPage, { LegalSection } from "./LegalPage";
import { Seo } from "@/components/Seo";

const Terms = () => {
  const { t } = useLocale();
  return (
    <>
      <Seo
        title={t("legal.terms.title")}
        description={t("legal.terms.intro")}
        path="/legal/terms"
      />
      <LegalPage
        titleKey="legal.terms.title"
        introKey="legal.terms.intro"
        updatedKey="legal.terms.updated"
      >
        <LegalSection title={t("legal.terms.useTitle")}>
          <p>{t("legal.terms.useBody")}</p>
        </LegalSection>
        <LegalSection title={t("legal.terms.accountsTitle")}>
          <p>{t("legal.terms.accountsBody")}</p>
        </LegalSection>
        <LegalSection title={t("legal.terms.liabilityTitle")}>
          <p>{t("legal.terms.liabilityBody")}</p>
        </LegalSection>
        <LegalSection title={t("legal.terms.changesTitle")}>
          <p>{t("legal.terms.changesBody")}</p>
        </LegalSection>
      </LegalPage>
    </>
  );
};

export default Terms;
