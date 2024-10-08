import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { UserConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
} as UserConfig);
