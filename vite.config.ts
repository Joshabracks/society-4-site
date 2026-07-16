import { defineConfig } from "vite";

export default defineConfig({
  base: "/society-4-site/",
  resolve: {
    extensions: [".sst.ts", ".mts", ".ts", ".jsx", ".js", ".tsx", ".json"],
  },
});
