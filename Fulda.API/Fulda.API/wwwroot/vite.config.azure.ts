import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// Static SPA build for Azure App Service (no Cloudflare Workers / SSR).
export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  define: {
    "import.meta.env.VITE_AZURE_STATIC": JSON.stringify("true"),
  },
  build: {
    outDir: "dist/azure",
    emptyOutDir: true,
  },
});
