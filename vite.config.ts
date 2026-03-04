import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("/scheduler/")) {
              return "react-vendor";
            }

            return "vendor";
          }

          if (id.includes("/src/core/") || id.includes("/src/book/") || id.endsWith("/src/index.ts")) {
            return "book-engine";
          }

          return undefined;
        }
      }
    }
  }
});
