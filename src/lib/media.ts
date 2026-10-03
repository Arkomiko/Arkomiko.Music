// Всё, что сайт узнаёт из contents_user/: обложки, треки, длительность, теги mp3, материалы.
// Работает только при сборке (на твоём компьютере или на хостинге), в браузер не попадает.
import path from 'node:path';
import { parseFile } from 'music-metadata';
import { getCollection, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { site, type ReleaseLicense } from '../site.config';
import type { PlayerTrack } from '../stores/player';
import type { Lang } from '../i18n';

/** RLS — релизы и пред-релизы, DR — черновики (папки в contents_user/traks/). */
export type Section = 'RLS' | 'DR';
export type Kind = 'single' | 'album' | 'ep' | 'cover' | 'techno-demo';
export type Status = 'released' | 'prerelease' | 'draft';
export type Entry = CollectionEntry<'rls'> | CollectionEntry<'dr'>;

/** Типы материалов = папки в contents_user/pack/. */
export const packCategories = ['Semples', 'Presets', 'Projects', 'Collection'] as const;
export type PackCategory = (typeof packCategories)[number];

// Vite находит все обложки и аудио и сам кладёт их в итоговую сборку.
const covers = import.meta.glob<{ default: ImageMetadata }>(
  ['/contents_user/traks/*/*/cover.{jpg,jpeg,png,webp}', '/contents_user/pack/*/*/cover.{jpg,jpeg,png,webp}'],
  { eager: true },
);
const audio = import.meta.glob<string>(
  ['/contents_user/traks/*/*/tracks/*.mp3', '/contents_user/pack/*/*/preview.mp3'],
  { eager: true, query: '?url', import: 'default' },
);

// Шаблонные обложки (src/assets/placeholders): Track — релизы и пред-релизы, Draft — черновики, Samples — материалы.
// В каждой папке два варианта: с подписью («Трек», «Черновик», «Сэмпл-пак») и без неё (no-text).
const placeholderFiles = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/placeholders/*/{png,no-text/png}/*.png',
  { eager: true },
);
type PlaceholderKind = 'Track' | 'Draft' | 'Samples';
const placeholders: Record<PlaceholderKind, Omit<Covers, 'placeholder'>[]> = {
  Track: [],
  Draft: [],
  Samples: [],
};
for (const kind of Object.keys(placeholders) as PlaceholderKind[]) {
  const base = `/src/assets/placeholders/${kind}/`;
  Object.keys(placeholderFiles)
    .filter((k) => k.startsWith(base + 'png/'))
    .sort()
    .forEach((k) => {
      const plain = placeholderFiles[k.replace(base + 'png/', base + 'no-text/png/')];
      placeholders[kind].push({
        labeled: placeholderFiles[k].default,
        plain: (plain ?? placeholderFiles[k]).default,
      });
    });
}

/** Обложка в двух вариантах: своя обложка — одна и та же; шаблонная — с подписью (RU) и без (EN, плеер). */
export type Covers = { labeled: ImageMetadata; plain: ImageMetadata; placeholder: boolean };

/** Обложка для страницы на нужном языке: на русском шаблонная с подписью, на английском — без. */
export function coverOf(x: { covers: Covers }, lang: Lang): ImageMetadata {
  return lang === 'ru' ? x.covers.labeled : x.covers.plain;
}

/** FNV-1a: одно и то же имя папки всегда даёт одно и то же число. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 0x01000193) >>> 0;
  return h;
}

/**
 * Своя cover.* из папки или шаблонная обложка. Шаблон закрепляется за папкой: номер считается от её имени
 * (или берётся из поля `placeholder` в release.md / pack.md) и не меняется, когда добавляются или удаляются другие.
 */
function coversFor(dir: string, slug: string, kind: PlaceholderKind, manual?: number): Covers {
  const key = Object.keys(covers).find((k) => k.startsWith(dir + 'cover.'));
  if (key) return { labeled: covers[key].default, plain: covers[key].default, placeholder: false };
  const pool = placeholders[kind];
  const i = manual ? (manual - 1) % pool.length : hash(slug) % pool.length;
  return { ...pool[i], placeholder: true };
}

export type Track = {
  /** Сквозной номер на сайте: 001, 002… — по дате выхода. */
  id: string;
  src: string;
  file: string;
  title: string;
  duration: number;
  bpm?: number;
  status: Status;
};

export type Item = {
  section: Section;
  slug: string;
  href: string;
  entry: Entry;
  title: string;
  date: Date;
  /** false — в release.md указан только год */
  exactDate: boolean;
  kind: Kind;
  status: Status;
  composition: 'original' | 'cover' | 'remix';
  genre?: string;
  bpm?: number;
  key?: string;
  tags: string[];
  covers: Covers;
  links: [string, string][];
  license: ReleaseLicense;
  download: boolean;
  tracks: Track[];
};

function toDate(v: number | Date): { date: Date; exactDate: boolean } {
  return typeof v === 'number'
    ? { date: new Date(Date.UTC(v, 0, 1)), exactDate: false }
    : { date: v, exactDate: true };
}

const visible = (e: { data: { draft: boolean } }) => !(import.meta.env.PROD && e.data.draft);

let catalog: Promise<Item[]> | undefined;

/** Все треки из traks/RLS и traks/DR, от новых к старым. Скрытые (draft: true) видны только в dev. */
export function getCatalog(): Promise<Item[]> {
  catalog ??= buildCatalog();
  return catalog;
}

async function buildCatalog(): Promise<Item[]> {
  const rls = (await getCollection('rls')) as Entry[];
  const dr = (await getCollection('dr')) as Entry[];
  const rlsSlugs = new Set(rls.map((e) => e.id));

  const items = await Promise.all([
    ...rls.filter(visible).map((e) => buildItem('RLS', e, e.id)),
    // Одинаковые папки в RLS и DR допустимы: черновик получает адрес с -draft.
    ...dr.filter(visible).map((e) => buildItem('DR', e, rlsSlugs.has(e.id) ? `${e.id}-draft` : e.id)),
  ]);

  // Сквозные ID треков: по дате, от старых к новым. На сайте список идёт в обратном порядке.
  items.sort((a, b) => a.date.getTime() - b.date.getTime() || a.title.localeCompare(b.title));
  let n = 0;
  items.forEach((item) => item.tracks.forEach((t) => (t.id = String(++n).padStart(3, '0'))));
  return items.reverse();
}

async function buildItem(section: Section, entry: Entry, slug: string): Promise<Item> {
  const data = entry.data;
  const dir = `/contents_user/traks/${section}/${entry.id}/`;
  const trackKeys = Object.keys(audio)
    .filter((k) => k.startsWith(dir + 'tracks/'))
    .sort();
  const tracks = await Promise.all(
    trackKeys.map((k, i) => readTrack(k, audio[k], data.tracks[i], data.status)),
  );

  return {
    section,
    slug,
    href: `/release/${slug}`,
    entry,
    title: data.title,
    ...toDate(data.date),
    kind: data.kind,
    status: data.status,
    composition: data.composition,
    genre: data.genre,
    bpm: data.bpm ?? tracks.find((t) => t.bpm)?.bpm,
    key: data.key,
    tags: data.tags,
    covers: coversFor(dir, entry.id, data.status === 'draft' ? 'Draft' : 'Track', data.placeholder),
    links: Object.entries(data.links),
    license: { ...site.license, ...data.license },
    download: data.download,
    tracks,
  };
}

// Название: из release.md → из тегов mp3 → из имени файла без номера.
async function readTrack(
  key: string,
  src: string,
  override: { title?: string; bpm?: number; status?: Status } = {},
  status: Status,
): Promise<Track> {
  const file = path.basename(key);
  const fallback = file
    .replace(/\.mp3$/i, '')
    .replace(/^\d+[-_. ]*/, '')
    .replace(/[-_]+/g, ' ');
  let title = fallback,
    duration = 0,
    bpm: number | undefined;
  try {
    const meta = await parseFile(path.join(process.cwd(), key), { duration: true });
    title = meta.common.title || fallback;
    duration = Math.round(meta.format.duration ?? 0);
    bpm = meta.common.bpm ? Math.round(meta.common.bpm) : undefined;
  } catch {}
  return {
    id: '',
    src,
    file,
    title: override.title ?? title,
    duration,
    bpm: override.bpm ?? bpm,
    status: override.status ?? status,
  };
}

/** Данные для плеера: только то, что можно отправить в браузер. */
export async function toPlayerTracks(item: Item): Promise<PlayerTrack[]> {
  // Плеер общий для обоих языков, поэтому шаблонная обложка в нём — без подписи.
  const thumb = (await getImage({ src: item.covers.plain, width: 112, height: 112 })).src;
  const large = (await getImage({ src: item.covers.plain, width: 720, height: 720 })).src;
  return item.tracks.map((t) => ({
    id: t.id,
    src: t.src,
    file: t.file,
    title: t.title,
    artist: site.name,
    release: item.title,
    kind: item.kind,
    href: item.href, // без языкового префикса: плеер и страницы добавляют его сами
    cover: thumb,
    coverLarge: large,
    duration: t.duration,
    genre: item.genre,
    bpm: t.bpm ?? item.bpm,
    status: t.status,
    download: item.download,
  }));
}

/** Все треки сайта для плеера и раздела «Музыка», от новых к старым. */
export async function getLibrary(): Promise<PlayerTrack[]> {
  const items = await getCatalog();
  return (await Promise.all(items.map(toPlayerTracks))).flat();
}

export function formatTime(sec: number): string {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Страницы /release/[slug]. */
export async function releasePaths() {
  const items = await getCatalog();
  return items.map((item) => ({ params: { slug: item.slug }, props: { item } }));
}

// Материалы: contents_user/pack/<Semples|Presets|Projects|Collection>/<папка>/pack.md
export type Pack = {
  slug: string;
  category: PackCategory;
  entry: CollectionEntry<'pack'>;
  date: Date;
  covers: Covers;
  preview?: string;
};

export async function getPacks(): Promise<Pack[]> {
  const entries = await getCollection('pack');
  return entries
    .filter(visible)
    .flatMap((entry) => {
      const [category, slug] = entry.id.split('/') as [PackCategory, string];
      if (!packCategories.includes(category)) return []; // посторонние папки в pack/ не показываем
      const dir = `/contents_user/pack/${entry.id}/`;
      return [
        {
          slug,
          category,
          entry,
          date: toDate(entry.data.date).date,
          covers: coversFor(dir, slug, 'Samples', entry.data.placeholder),
          preview: audio[dir + 'preview.mp3'],
        },
      ];
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

/** Тексты лицензий из contents_user/licenses/*.md (по полю order). */
export async function getLicenses() {
  return (await getCollection('licenses')).sort((a, b) => a.data.order - b.data.order);
}

/**
 * Какое пустое состояние показать вместо страницы:
 * content — в contents_user/ нет ни треков, ни материалов (non_content_user);
 * tracks — нет треков (non_traks, для «Музыки»); packs — нет материалов (non_pack, для «Материалов»).
 */
export async function emptyKind(
  page: 'home' | 'music' | 'materials',
): Promise<'content' | 'tracks' | 'packs' | null> {
  const noTracks = (await getCatalog()).length === 0;
  const noPacks = (await getPacks()).length === 0;
  if (noTracks && noPacks) return 'content';
  if (page === 'music' && noTracks) return 'tracks';
  if (page === 'materials' && noPacks) return 'packs';
  return null;
}
