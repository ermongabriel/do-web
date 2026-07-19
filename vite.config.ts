import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Inject the manifest into index.html and generate the SW.
      injectRegister: "auto",
      registerType: "autoUpdate",
      includeAssets: ["icon.png", "logo.png", "icon.svg", "favicon.svg"],
      manifest: {
        name: "Do — Structured school communication",
        short_name: "Do",
        description:
          "Do replaces scattered WhatsApp groups with one structured, offline-first space for school communication — content, polls, and a consent-based AI tutor for every teacher.",
        theme_color: "#0a528e",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        lang: "en",
        categories: ["education", "productivity", "communication"],
        icons: [
          { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
          { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        // Precache the app shell so the site boots with no network at all.
        globPatterns: ["**/*.{js,css,html,svg,png,woff2,woff}"],
        navigateFallback: "/index.html",
        // Never serve a stale index.html from cache — always revalidate so
        // new deploys are picked up, while cached assets stay available offline.
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        runtimeCaching: [
          {
            // App navigations: try network, fall back to cached shell offline.
            urlPattern: ({ request }) =>
              request.mode === "navigate" && request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages",
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Static assets: cache-first (they're content-hashed).
            urlPattern: ({ request }) =>
              ["style", "script", "worker", "image", "font"].includes(request.destination),
            handler: "CacheFirst",
            options: {
              cacheName: "assets",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // API calls: network-first, don't cache failures offline.
            urlPattern: ({ url }) => url.pathname.startsWith("/api/"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api",
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        // Enable the SW during dev so offline behavior is testable.
        enabled: false,
        navigateFallback: "/index.html",
        suppressWarnings: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Split heavy, rarely-changing vendors into their own long-lived chunks
    // so the initial app shell stays small and browsers can cache vendors
    // independently of app code. This also clears the >500kB chunk warning.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) return "motion-vendor";
            if (id.includes("react-router")) return "router-vendor";
            if (id.includes("react-dom") || id.includes("/react/")) return "react-vendor";
          }
          return undefined;
        },
      },
    },
  },
})
