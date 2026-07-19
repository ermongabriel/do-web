import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HelmetProvider } from "react-helmet-async"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { DIProvider } from "@/di/context.tsx"
import registerServices from "@/bootstrap/registerServices.ts"
import { LocaleProvider } from "@/locale/index.tsx"
import ErrorBoundary from "@/components/ErrorBoundary.tsx"

// Importing vercel configs
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

registerServices()

createRoot(document.getElementById("root")!).render(
  <>
    <Analytics />
    <SpeedInsights />
    <StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <DIProvider>
            <ThemeProvider>
              <LocaleProvider>
                <App />
              </LocaleProvider>
            </ThemeProvider>
          </DIProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </StrictMode>
  </>
)
