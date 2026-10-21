// Языки сайта. Шаблон с ключами и подсказками — src/i18n.ts, переводы — languages/*.ts (по файлу на язык).
// Новый язык = новый файл в languages/: сайт сам добавит его в переключатель и соберёт страницы /<код>/….
// Нет перевода ключа — показывается подсказка из шаблона в [квадратных скобках].
import template, { type UiKey } from '../i18n';
import { defaultLang, localize } from './locale';

export { defaultLang, localize };
export type { UiKey };

/** Код языка — он же префикс адреса: 'en' → /en/about. */
export type Lang = string;

export type Language = {
  /** Код языка ISO 639-1 (en), а если его нет — ISO 639-3 (hsb): префикс адреса и атрибут lang. */
  code: string;
  /** Локаль для дат и чисел: 'de-DE'. */
  locale: string;
  /** Название на самом языке — так язык показан в переключателе. */
  name: string;
  /** Название по-английски — для сортировки списка и подсказки. */
  nameEn: string;
  /** Направление письма: rtl — для арабского, персидского, урду. */
  dir?: 'ltr' | 'rtl';
  /** Переводы: ключи из src/i18n.ts. Чего нет — берётся подсказка из шаблона. */
  ui: Partial<Record<UiKey, string>>;
};

const files = import.meta.glob<{ default: Language }>('/languages/*.ts', { eager: true });
const all = Object.values(files).map((f) => f.default);

if (!all.some((l) => l.code === defaultLang))
  throw new Error(`languages/: нет файла основного языка «${defaultLang}»`);
const seen = new Set<string>();
for (const l of all) {
  if (seen.has(l.code)) throw new Error(`languages/: код «${l.code}» встречается в двух файлах`);
  seen.add(l.code);
}

/** Все языки: основной, затем английский, затем по английскому названию. */
export const languages: Language[] = all.sort(
  (a, b) =>
    Number(b.code === defaultLang) - Number(a.code === defaultLang) ||
    Number(b.code === 'en') - Number(a.code === 'en') ||
    a.nameEn.localeCompare(b.nameEn),
);
export const langs: Lang[] = languages.map((l) => l.code);
const byCode = new Map(languages.map((l) => [l.code, l]));

export function isLang(v: unknown): v is Lang {
  return typeof v === 'string' && byCode.has(v);
}

export function langInfo(lang: Lang): Language {
  return byCode.get(lang) ?? byCode.get(defaultLang)!;
}

const keys = Object.keys(template) as UiKey[];

/** Текст элемента: перевод или подсказка из шаблона. */
function text(lang: Lang, key: UiKey): string {
  return langInfo(lang).ui[key] || template[key];
}

/** t('count.Semples.few', { n: 24 }) → «24 сэмпла» */
export function useT(lang: Lang) {
  return (key: UiKey, vars: Record<string, string | number> = {}) =>
    text(lang, key).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

/** Несколько текстов одним объектом — для Vue-компонентов: в браузер уходят только они, а не словари всех языков. */
export function strings<K extends UiKey>(lang: Lang, list: readonly K[]): Record<K, string> {
  return Object.fromEntries(list.map((k) => [k, text(lang, k)])) as Record<K, string>;
}

/** Ключи, которые читают Vue-компоненты. */
export const clientKeys = {
  playButton: ['player.play', 'player.pause', 'release.listen'],
  tracklist: ['player.listen', 'player.pause'],
  trackTable: [
    'home.seeAll',
    'home.empty',
    'filter.status',
    'filter.all',
    'filter.released',
    'filter.prerelease',
    'filter.drafts',
    'col.id',
    'col.cover',
    'col.title',
    'col.time',
    'col.genre',
    'col.type',
    'status.released',
    'status.prerelease',
    'status.draft',
    'player.download',
    'player.listen',
    'player.pause',
  ],
  player: [
    'player.play',
    'player.pause',
    'player.prev',
    'player.next',
    'player.seek',
    'player.volume',
    'player.nowPlaying',
    'player.collapse',
    'player.expand',
    'player.shuffle',
    'player.repeat',
    'player.upNext',
    'player.license',
    'theme.toLight',
    'theme.toDark',
    'kind.single',
    'kind.album',
    'kind.ep',
    'kind.cover',
    'kind.techno-demo',
    'kind.samples',
  ],
} as const satisfies Record<string, readonly UiKey[]>;

/** Доля переведённых ключей, 0–1. Неполные языки не индексируются поисковиками. */
export function coverage(lang: Lang): number {
  const ui = langInfo(lang).ui;
  return keys.filter((k) => ui[k]).length / keys.length;
}

/** Язык по адресу страницы: /en/... → en, остальное → основной. */
export function langFromPath(pathname: string): Lang {
  const first = pathname.split('/')[1];
  return isLang(first) ? first : defaultLang;
}

/** Путь без языкового префикса: /en/about → /about */
export function stripLang(pathname: string): string {
  const first = pathname.split('/')[1];
  return isLang(first) && first !== defaultLang ? pathname.slice(first.length + 1) || '/' : pathname;
}

/** getStaticPaths для страниц src/pages/[lang]/: все языки, кроме основного. */
export function langPaths() {
  return langs.filter((l) => l !== defaultLang).map((lang) => ({ params: { lang }, props: { lang } }));
}

export function formatDate(d: Date, exact: boolean, lang: Lang): string {
  if (!exact) return String(d.getUTCFullYear());
  return d.toLocaleDateString(langInfo(lang).locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
