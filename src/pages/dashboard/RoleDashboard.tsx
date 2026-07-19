import { useLocale } from "@/locale";
import { LogOut } from "lucide-react";
import { useService } from "@/di/context";
import { TOKENS } from "@/di/container";
import { AuthService, type UserRole } from "@/services/authService";
import { shadowButton } from "@/lib/utils";

// Lightweight role dashboard placeholder. The real surfaces get built per
// role later; this proves the route + guard wiring works and greets the
// user in their own area only.
export default function RoleDashboard({ role }: { role: UserRole }) {
  const { t } = useLocale();
  const auth = useService<AuthService>(TOKENS.AuthService);
  const user = auth.getUser();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-12 lg:py-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-3 font-mono text-sm text-muted-foreground mb-4">
            <span className="h-px w-8 bg-foreground/30" />
            {t(`dashboard.${role}`)}
          </span>
          <h1 className="font-display text-4xl lg:text-5xl tracking-tight">
            {t("dashboard.welcome")}
          </h1>
        </div>
        <button
          onClick={() => auth.logout()}
          className={`flex items-center gap-2 rounded-none border-2 border-solid border-foreground px-4 py-2 text-sm ${shadowButton}`}
        >
          <LogOut className="h-4 w-4" />
          {t("dashboard.signOut")}
        </button>
      </div>

      <div className="border border-foreground/10 p-8 lg:p-12">
        <p className="text-muted-foreground">
          {user?.email ? `${user.email} · ${t(`dashboard.${role}`)}` : t(`dashboard.${role}`)}
        </p>
        <p className="mt-4 text-sm text-muted-foreground/70">
          {t("dashboard.yourArea")}
        </p>
      </div>
    </div>
  );
}
