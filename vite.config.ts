import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "client"),

  build: {
    outDir: "dist",          // ✅ RELATIVE path
    emptyOutDir: true
  },

  server: {
    port: 5173
  },

  plugins: [react()]
});