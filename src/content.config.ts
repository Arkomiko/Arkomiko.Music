import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Весь пользовательский контент лежит в contents_user/:
//   traks/RLS/<папка>/release.md   — релизы и пред-релизы
//   traks/DR/<папка>/release.md    — черновики
//   pack/<Semples|Presets|Projects|Collection>/<папка>/pack.md — материалы
//   licenses/*.md                  — тексты лицензий
// Имя папки = адрес страницы: traks/RLS/4wio → /release/4wio. Поле slug в release.md задаёт адрес вручную
// (по умолчанию папка RLS0001 → /release/RLS0001, как каталожные номера у Monstercat).

const idFromFolder = ({ entry }: { entry: string }) => entry.split('/')[0];

/** Релизная / Пред-релизная / Черновик */
const status = z.enum(['released', 'prerelease', 'draft']);
/** Можно / Условия / Нельзя */
const permission = z.enum(['allowed', 'conditions', 'forbidden']);
/** Номер шаблонной обложки (1, 2, …), если хочется выбрать её вручную. Без него номер считается от имени папки. */
const placeholder = z.number().int().positive().optional();

const track = {
  title: z.string(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'адрес: латиница в нижнем регистре, цифры и дефис')
    .optional(), // адрес страницы /release/<slug>; без него — имя папки
  // Можно указать только год (date: 2022) или полную дату (date: 2026-03-14).
  date: z.union([z.number().int(), z.coerce.date()]),
  kind: z.enum(['single', 'album', 'ep', 'cover', 'techno-demo']),
  status,
  composition: z.enum(['original', 'cover', 'remix']).default('original'),
  genre: z.string().optional(),
  language: z.string().optional(), // язык названия релиза: код ISO 639-1 (en, ru, ja) или название
  label: z.string().optional(), // лейбл / копирайт
  upc: z.coerce
    .string()
    .regex(/^\d{12,14}$/, 'UPC/EAN — 12–14 цифр')
    .optional(), // в кавычках, чтобы не потерять ведущие нули
  bpm: z.number().optional(),
  key: z.string().optional(), // «A minor»
  tags: z.array(z.string()).default([]),
  // Переопределения для треков по порядку файлов в tracks/: название, BPM, статус.
  tracks: z
    .array(z.object({ title: z.string().optional(), bpm: z.number().optional(), status: status.optional() }))
    .default([]),
  links: z.record(z.string(), z.string().url()).default({}),
  license: z
    .object({
      name: z.string(), // «Условия лейбла …», «CC BY-NC-SA 4.0»
      url: z.string(),
      streams: permission,
      monetization: permission,
      remixes: permission,
      credit: z.string(),
    })
    .partial()
    .optional(),
  download: z.boolean().default(true),
  credits: z.array(z.string()).default([]),
  placeholder,
  draft: z.boolean().default(false), // скрыть с сайта: виден только в npm run dev
};

const rls = defineCollection({
  loader: glob({ pattern: '*/release.md', base: './contents_user/traks/RLS', generateId: idFromFolder }),
  schema: z.object({ ...track, kind: track.kind.default('single'), status: status.default('released') }),
});

const dr = defineCollection({
  loader: glob({ pattern: '*/release.md', base: './contents_user/traks/DR', generateId: idFromFolder }),
  schema: z.object({ ...track, kind: track.kind.default('techno-demo'), status: status.default('draft') }),
});

const pack = defineCollection({
  // id = «Semples/example-pack»: тип материала берётся из папки.
  loader: glob({
    pattern: '*/*/pack.md',
    base: './contents_user/pack',
    generateId: ({ entry }) => entry.split('/').slice(0, 2).join('/'),
  }),
  schema: z.object({
    title: z.string(),
    date: z.union([z.number().int(), z.coerce.date()]),
    count: z.number().int().optional(), // сэмплов, пресетов, проектов или файлов — по типу папки
    bpm: z.string().optional(),
    key: z.string().optional(),
    genre: z.string().optional(),
    format: z.string().optional(), // «WAV 24-bit», «FL Studio 21», «Serum»
    tags: z.array(z.string()).default([]),
    price: z.string().default('free'), // 'free' или цена строкой
    license: z.enum(['free', 'standard', 'extended']).optional(), // без поля: free для бесплатных, иначе standard
    download: z.string().url().optional(),
    placeholder,
    draft: z.boolean().default(false),
  }),
});

const licenses = defineCollection({
  loader: glob({ pattern: '*.md', base: './contents_user/licenses' }),
  schema: z.object({
    title: z.string(),
    group: z.enum(['music', 'pack']), // музыка (релизы, демо) или материалы (сэмплы, пресеты, проекты)
    order: z.number().default(0),
    price: z.string().optional(),
  }),
});

export const collections = { rls, dr, pack, licenses };
