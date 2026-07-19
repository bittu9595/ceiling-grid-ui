import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, "src/styles")],
        additionalData: (content: string, filePath: string) => {
          // Don't inject into base style files to avoid circular imports
          if (filePath.includes("src/styles/")) {
            return content;
          }
          return `@use "variables" as *;\n@use "mixins" as *;\n${content}`;
        },
      },
    },
  },
});
