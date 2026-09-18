import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000, // Replace with your preferred port number
    strictPort: true, // Optional: if true, Vite will exit if the port is already in use
  },
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});
