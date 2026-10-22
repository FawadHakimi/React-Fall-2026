import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" makes the built app work from any sub-folder (GitHub Pages, Vercel, Netlify...)
export default defineConfig({
  plugins: [react()],
  base: "./",
});
