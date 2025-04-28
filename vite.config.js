import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({
  base: "catalogo-filmes",
  plugins: [
    react()
  ],
});