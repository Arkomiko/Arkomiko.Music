// Всё, что сайт узнаёт из файлов в папке релиза: обложка, треки, длительность, цвет.
// Работает только при сборке (на твоём компьютере или на хостинге), в браузер не попадает.
import path from 'node:path';
import sharp from 'sharp';
import { parseFile } from 'music-metadata';
import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { site, typeLabels, type License } from '../site.config';

export type Kind = 'releases' | 'demos';
export type Entry = CollectionEntry<'releases'> | CollectionEntry<'demos'>;

// Vite находит все обложки и mp3 и сам кладёт их в итоговую сборку.
const covers = import.meta.glob<{ default: ImageMetadata }>(
  ['/releases/*/cover.{jpg,jpeg,png,webp}', '/demos/*/cover.{jpg,jpeg,png,webp}'],
  { eager: true },
);
const audio = import.meta.glob<string>(['/releases/*/tracks/*.mp3', '/demos/*/tracks/*.mp3'], {
  eager: true,
  query: '?url',
  import: 'default',
});

export type Track = {
  src: string;
  title: string;
  duration: number;
  file: string;
};

export type Item = {
  kind: Kind;
  id: string;
  href: string;
  entry: Entry;
  title: string;
  date: Date;
  typeLabel: string;
  cover?: ImageMetadata;
  accent: string;
  license: License;
  tracks: Track[];
};

const cache = new Map<string, Promise<Item>>();

/** Все релизы или демки, от новых к старым. Черновики (draft: true) видны только в dev. */
export async function getItems(kind: Kind): Promise<Item[]> {
  const entries = (await getCollection(kind)) as Entry[];
  const items = await Promise.all(
    entries.filter((e) => !(import.meta.env.PROD && e.data.draft)).map((e) => toItem(kind, e)),
  );
  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function toItem(kind: Kind, entry: Entry): Promise<Item> {
  const key = `${kind}/${entry.id}`;
  if (!cache.has(key)) cache.set(key, buildItem(kind, entry));
  return cache.get(key)!;
}

async function buildItem(kind: Kind, entry: Entry): Promise<Item> {
  const prefix = `/${kind}/${entry.id}/`;
  const coverKey = Object.keys(covers).find((k) => k.startsWith(prefix + 'cover.'));
  const cover = coverKey ? covers[coverKey].default : undefined;

  const trackKeys = Object.keys(audio)
    .filter((k) => k.startsWith(prefix + 'tracks/'))
    .sort();
  const tracks = await Promise.all(trackKeys.map((k) => readTrack(k, audio[k])));

  const accent =
    entry.data.accent ?? (coverKey ? await accentFrom(path.join(process.cwd(), coverKey)) : site.accent);

  const type = 'type' in entry.data ? entry.data.type : 'demo';

  return {
    kind,
    id: entry.id,
    href: `/${kind}/${entry.id}`,
    entry,
    title: entry.data.title,
    date: entry.data.date,
    typeLabel: typeLabels[type],
    cover,
    accent,
    license: entry.data.license ?? site.licenses[kind],
    tracks,
  };
}

// Название берётся из тегов mp3; если тегов нет — из имени файла без номера.
async function readTrack(key: string, src: string): Promise<Track> {
  const file = path.basename(key);
  const fallback = file
    .replace(/\.mp3$/i, '')
    .replace(/^\d+[-_. ]*/, '')
    .replace(/[-_]+/g, ' ');
  try {
    const meta = await parseFile(path.join(process.cwd(), key), { duration: true });
    return {
      src,
      file,
      title: meta.common.title || fallback,
      duration: Math.round(meta.format.duration ?? 0),
    };
  } catch {
    return { src, file, title: fallback, duration: 0 };
  }
}

// Преобладающий цвет обложки, подтянутый до читаемой яркости на тёмном фоне.
async function accentFrom(file: string): Promise<string> {
  try {
    const { dominant } = await sharp(file).stats();
    let [h, s, l] = rgbToHsl(dominant.r, dominant.g, dominant.b);
    s = Math.min(Math.max(s, 0.35), 0.85);
    l = Math.min(Math.max(l, 0.64), 0.78);
    return hslToHex(h, s, l);
  } catch {
    return site.accent;
  }
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  const f = (n: number) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function formatTime(sec: number): string {
  if (!sec) return '';
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Данные для плеера: только то, что можно отправить в браузер. */
export function toPlayerTracks(item: Item, coverSrc?: string) {
  return item.tracks.map((t) => ({
    src: t.src,
    title: t.title,
    artist: site.name,
    release: item.title,
    href: item.href,
    cover: coverSrc,
    accent: item.accent,
    duration: t.duration,
  }));
}

export function tracksLabel(n: number): string {
  const m10 = n % 10,
    m100 = n % 100;
  const word =
    m10 === 1 && m100 !== 11 ? 'трек' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'трека' : 'треков';
  return `${n} ${word}`;
}
