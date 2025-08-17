import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": "./client/src",
      "@shared": "./shared",
      "@assets": "./attached_assets",
    },
  },
  root: "./client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  base: "/admission2/",
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
