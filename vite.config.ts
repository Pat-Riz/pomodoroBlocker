import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        index: "index.html",
        background: "src/backgroundWorker/background.ts",
      },
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
