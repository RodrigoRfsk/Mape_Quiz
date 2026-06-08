/// <reference types="vitest/config" />
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

// Reaproveita os aliases/plugins do vite.config, mas usa a RAIZ do repo como
// root dos testes — o vite.config define `root: client`, o que escondia os
// specs de server/ e shared/.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      root: import.meta.dirname,
      include: [
        "client/src/**/*.spec.{ts,tsx}",
        "server/src/**/*.spec.{ts,tsx}",
        "shared/**/*.spec.{ts,tsx}",
      ],
    },
  })
);
