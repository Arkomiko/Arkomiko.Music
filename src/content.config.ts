import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Имя папки = адрес страницы: releases/cold-memories → /releases/cold-memories
const idFromFolder = ({ entry }: { entry: string }) => entry.split('/')[0];

const license = z
  .union([
    z.string().transform((name) => ({ name })),
    z.object({ name: z.string(), url: z.url().optional() }),
  ])
  .optional();

const common = {
  title: z.string(),
  date: z.coerce.date(),
  links: z.record(z.string(), z.url()).default({}),
  license,
  download: z.boolean().default(false),
  accent: z.string().optional(),
  // Можно писать как «- Музыка: Arkomiko» — YAML превратит это в пару, мы склеим обратно.
  credits: z
    .array(
      z.union([
        z.string(),
        z.record(z.string(), z.string()).transform((o) =>
          Object.entries(o)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', '),
        ),
      ]),
    )
    .default([]),
  draft: z.boolean().default(false),
};

const releases = defineCollection({
  loader: glob({ pattern: '*/release.md', base: './releases', generateId: idFromFolder }),
  schema: z.object({ ...common, type: z.enum(['single', 'ep', 'album']).default('single') }),
});

const demos = defineCollection({
  loader: glob({ pattern: '*/release.md', base: './demos', generateId: idFromFolder }),
  schema: z.object({ ...common, released_as: z.string().optional() }),
});

export const collections = { releases, demos };
