import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  clean: true,
  format: ["cjs"],
  resolve: {
    alias: {
      "@config/*": "./config/*",
      "@controllers/*": "./src/controllers/*",
      "@models/*": "./src/models/*",
      "@middlewares/*": "./src/middlewares/*",
      "@services/*": "./src/services/*",
      "@routes/*": "./src/routes/*",
      "@utils/*": "./src/utils/*",
      "@tests/*": "./src/tests/*",
      "@views/*": "./src/views/*",
    },
  },
  ...options,
}));
