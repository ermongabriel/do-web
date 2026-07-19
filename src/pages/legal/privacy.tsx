import { useLocale } from "@/locale";
import LegalPage, { LegalSection } from "./LegalPage";
import { Seo } from "@/components/Seo";

const Privacy = () => {
  const { t } = useLocale();
  return (
    <>
      <Seo
        title={t("legal.privacy.title")}
        description={t("legal.privacy.intro")}
        path="/legal/privacy"
      />
      <LegalPage
        titleKey="legal.privacy.title"
        introKey="legal.privacy.intro"
        updatedKey="legal.privacy.updated"
      >
      <LegalSection title={t("legal.privacy.dataTitle")}>
        <p>{t("legal.privacy.dataBody")}</p>
      </LegalSection>
      <LegalSection title={t("legal.privacy.useTitle")}>
        <p>{t("legal.privacy.useBody")}</p>
      </LegalSection>
      <LegalSection title={t("legal.privacy.rightsTitle")}>
        <p>{t("legal.privacy.rightsBody")}</p>
      </LegalSection>
      <LegalSection title={t("legal.privacy.contactTitle")}>
        <p>{t("legal.privacy.contactBody")}</p>
      </LegalSection>
    </LegalPage>
    </>
  );
};

export default Privacy;
