import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // The physics worker is bundled as a module worker; Vite handles that with
  // `new Worker(new URL(...), { type: "module" })`.
  worker: {
    format: "es",
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    // The whole UI kit (motion + Base UI) lands in the entry chunk by design;
    // routes are lazy so /gallery and /resume stay off the first load.
    chunkSizeWarningLimit: 700,
  },
});
