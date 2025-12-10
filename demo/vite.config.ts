import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "react-ui-suite": path.resolve(__dirname, "..", "src"),
      "@demo-components": path.resolve(__dirname, "..", "src", "components"),
    },
  },
  server: {
    open: true,
  },
});
