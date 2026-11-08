import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// A raiz é relativa ao diretório de trabalho do `npm run dev:frontend`.
export default defineConfig({
  plugins: [react()],
  root: "src/frontend",
  server: {
    host: "127.0.0.1",
    port: 5174,
    strictPort: true,
  },
});
