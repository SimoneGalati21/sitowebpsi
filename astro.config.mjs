import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // site: 'https://USERNAME.github.io',
  // base: '/sitowebpsi',
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
