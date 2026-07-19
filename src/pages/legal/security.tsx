import { useLocale } from "@/locale";
import LegalPage, { LegalSection } from "./LegalPage";
import { Seo } from "@/components/Seo";

const Security = () => {
  const { t } = useLocale();
  return (
    <>
      <Seo
        title={t("legal.security.title")}
        description={t("legal.security.intro")}
        path="/legal/security"
      />
      <LegalPage
        titleKey="legal.security.title"
        introKey="legal.security.intro"
        updatedKey="legal.security.updated"
      >
        <LegalSection title={t("legal.security.encryptTitle")}>
          <p>{t("legal.security.encryptBody")}</p>
        </LegalSection>
        <LegalSection title={t("legal.security.consentTitle")}>
          <p>{t("legal.security.consentBody")}</p>
        </LegalSection>
        <LegalSection title={t("legal.security.isolationTitle")}>
          <p>{t("legal.security.isolationBody")}</p>
        </LegalSection>
        <LegalSection title={t("legal.security.certTitle")}>
          <p>{t("legal.security.certBody")}</p>
        </LegalSection>
      </LegalPage>
    </>
  );
};

export default Security;
