import { defineConfig } from 'astro/config';

// Toggle base path/site for GitHub Pages via env (default: ON).
// Disable with ASTRO_BASE=0 (used by test pipeline for clean URLs).
const baseEnabled = process.env.ASTRO_BASE !== '0';

export default defineConfig({
  ...(baseEnabled
    ? {
        site: 'https://simonegalati21.github.io',
        base: '/sitowebpsi',
        trailingSlash: 'ignore',
      }
    : {}),
  server: {
    host: true,
    port: 4321,
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 300,
      },
    },
  },
});
