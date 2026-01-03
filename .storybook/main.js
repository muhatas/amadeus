import path from "node:path";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";

/** @type { import('@storybook/nextjs-vite').StorybookConfig } */

const __dirname =
  typeof globalThis.__dirname !== "undefined"
    ? globalThis.__dirname
    : path.dirname(fileURLToPath(import.meta.url));

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"], // Windows backslash yerine böyle daha sağlıklı
  viteFinal: async (baseConfig) => {
    return mergeConfig(baseConfig, {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
        },
      }
    });
  },
};

export default config;
