import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://52.90.187.5:3000",
        changeOrigin: true,
      },
    },
  },
});
