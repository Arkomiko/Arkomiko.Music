import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  site: 'https://arkomiko.music',
  integrations: [vue()],
  // Панель разработчика Astro в dev перекрывает нижний плеер.
  devToolbar: { enabled: false },
  vite: {
    server: {
      watch: {
        // Следим только за исходниками сайта. Скрытые служебные папки (кроме .astro), сборка, svg-исходники
        // заглушек и WAV не нужны: на Windows слежение за ними падает с EBUSY, пока файлы копируются.
        ignored: [
          /[\\/]\.(?!astro(?:[\\/]|$))[^\\/]+(?:[\\/]|$)/,
          '**/dist/**',
          '**/src/assets/placeholders/**/svg/**',
          '**/*.wav',
        ],
      },
    },
  },
});
