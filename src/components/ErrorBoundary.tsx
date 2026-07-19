import { Component, type ErrorInfo, type ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useLocale } from "@/locale";
import { Button } from "@/components/ui/button";
import { shadowButton } from "@/lib/utils";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

// Catches render-time exceptions anywhere in the tree so a single broken
// component degrades to a friendly fallback instead of a blank white page.
// The fallback reuses the site's hard-shadow button treatment for consistency.
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface the error in the console for debugging; swap for a real
    // monitoring service (Sentry, etc.) in production.
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
  }
}

function ErrorFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  const { t } = useLocale();
  const message =
    error?.message || t("notfound.description", "Something went wrong on our end.");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden noise-overlay bg-background px-6 py-24 text-center">
      <div
        className="pointer-events-none absolute -top-1/3 left-1/2 -z-10 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "var(--gradient-color)" }}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative max-w-xl"
      >
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-none border-2 border-solid border-foreground bg-gradient-primary text-primary-foreground shadow-[3px_3px_0px_0px_var(--foreground)]">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
          {t("error.title", "Something broke")}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          {t("error.description", "An unexpected error occurred. You can try again or head back home.")}
        </p>

        {import.meta.env.DEV && message && (
          <pre className="mx-auto mt-6 max-w-md overflow-auto rounded-none border border-foreground/10 bg-foreground/5 p-4 text-left font-mono text-xs text-muted-foreground">
            {message}
          </pre>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/">
            <Button
              size="lg"
              className={`bg-gradient-primary rounded-none border-2 border-solid border-foreground text-primary-foreground ${shadowButton}`}
            >
              <Home className="mr-2 h-4 w-4" />
              {t("notfound.goHome", "Back to home")}
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={onReset}
            className={`rounded-none border-2 border-solid border-foreground text-foreground ${shadowButton}`}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {t("error.tryAgain", "Try again")}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default ErrorBoundary;
