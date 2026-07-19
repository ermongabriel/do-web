import type { ReactNode } from "react";
import { useLocale } from "@/locale";
import { useEffect } from "react";

// Shared shell for legal documents: sets the document title, renders a
// styled heading + a comfortable reading column with section helpers.
export default function LegalPage({
  titleKey,
  introKey,
  updatedKey,
  children,
}: {
  titleKey: string;
  introKey: string;
  updatedKey: string;
  children: ReactNode;
}) {
  const { t } = useLocale();

  useEffect(() => {
    document.title = `${t(titleKey)} — Do`;
  }, [t, titleKey]);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
      <span className="inline-flex items-center gap-3 font-mono text-sm text-muted-foreground mb-6">
        <span className="h-px w-8 bg-foreground/30" />
        Do
      </span>
      <h1 className="font-display text-4xl lg:text-5xl tracking-tight mb-6">
        {t(titleKey)}
      </h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-4">
        {t(introKey)}
      </p>
      <p className="text-xs font-mono text-muted-foreground/70 mb-12">
        {t(updatedKey)}
      </p>
      <div className="space-y-10 text-[15px] leading-relaxed text-foreground/80">
        {children}
      </div>
    </article>
  );
}

// Section helper used inside legal pages.
export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl lg:text-2xl tracking-tight text-foreground mb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
