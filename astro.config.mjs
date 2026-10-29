import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

// Домен сайта — из личного профиля (contents_user/profile/site.json, в git не попадает).
const profile = 'contents_user/profile/site.json';
const site = existsSync(profile) ? JSON.parse(readFileSync(profile, 'utf8')).url : 'https://example.com';

// Скрытые релизы (draft: true) не попадают на страницы, но Vite всё равно копирует их mp3 и обложки в сборку.
// После сборки удаляем из _astro медиафайлы, на которые не ссылается ни одна страница, — иначе их можно скачать
// по прямой ссылке.
const pruneMedia = {
  name: 'prune-unused-media',
  hooks: {
    'astro:build:done': ({ dir, logger }) => {
      const out = fileURLToPath(dir);
      const files = readdirSync(out, { recursive: true }).map(String);
      const text = files
        .filter((f) => /\.(html|js|css|json)$/.test(f))
        .map((f) => readFileSync(join(out, f), 'utf8'))
        .join('\n');
      const media = /^_astro[\\/].+\.(mp3|wav|flac|ogg|m4a|jpe?g|png|webp|avif|gif)$/i;
      for (const f of files.filter((f) => media.test(f))) {
        if (text.includes(basename(f))) continue;
        rmSync(join(out, f));
        logger.info(`не используется, в сборку не попал: ${basename(f)}`);
      }
    },
  },
};

export default defineConfig({
  site,
  integrations: [vue(), pruneMedia],
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
