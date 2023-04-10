import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: "index.html",
        background: "public/background2.ts",
      },
      output: {
        entryFileNames: "background2.js",
      },
    },
  },
});
