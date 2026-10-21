// Что можно делать с музыкой и материалами — две таблицы на странице «Лицензии».
// Меняются условия — меняешь здесь. Подписи — ключи текстов (src/i18n.ts, переводы — languages/).
// Полные тексты лицензий — contents_user/licenses/*.md.
import type { UiKey } from '../../lib/lang';

/** Ячейка таблицы: y — можно, c — с условием, d — по договору или согласованию, n — нельзя. label — своя подпись. */
export type Cell = { p: 'y' | 'c' | 'd' | 'n'; label?: UiKey };
export type Table = { id: string; title: UiKey; columns: UiKey[]; rows: { use: UiKey; cells: Cell[] }[] };

/** Цвет плашки: можно — розовая заливка, условия — розовый контур, нельзя — серая. */
export const pillClass = { y: 'badge-fill', c: 'badge-ink', d: 'badge-ink', n: 'badge-muted' } as const;
/** Подпись плашки по умолчанию. */
export const pillLabel: Record<Cell['p'], UiKey> = {
  y: 'licenses.yes',
  c: 'licenses.cond',
  d: 'licenses.contract',
  n: 'licenses.no',
};

const labelTerms: Cell = { p: 'c', label: 'licenses.labelTerms' };
const nonCommercial: Cell = { p: 'c', label: 'licenses.nc' };
const yes: Cell = { p: 'y' };
const no: Cell = { p: 'n' };
const contract: Cell = { p: 'd' };

/** Музыка: релизы вне лейбла · техно-демки и черновики (CC BY-NC-SA 4.0) · релизы через лейбл. */
export const musicTable: Table = {
  id: 'music-table',
  title: 'licenses.musicAllowed',
  columns: ['licenses.col.releases', 'licenses.col.demos', 'licenses.col.label'],
  rows: [
    { use: 'licenses.use.streams', cells: [yes, nonCommercial, labelTerms] },
    { use: 'licenses.use.videos', cells: [yes, nonCommercial, labelTerms] },
    { use: 'licenses.use.monetization', cells: [yes, no, labelTerms] },
    { use: 'licenses.use.podcasts', cells: [yes, nonCommercial, labelTerms] },
    {
      use: 'licenses.use.remixes',
      cells: [{ p: 'd', label: 'licenses.approval' }, nonCommercial, labelTerms],
    },
    { use: 'licenses.use.games', cells: [contract, no, labelTerms] },
    { use: 'licenses.use.ads', cells: [contract, no, labelTerms] },
    { use: 'licenses.use.contentId', cells: [no, no, no] },
  ],
};

/** Материалы: Free · Standard · Extended. */
export const packTable: Table = {
  id: 'materials-table',
  title: 'licenses.packsAllowed',
  columns: ['licenses.free', 'licenses.standard', 'licenses.extended'],
  rows: [
    { use: 'licenses.p.music', cells: [yes, yes, yes] },
    { use: 'licenses.p.sync', cells: [{ p: 'c', label: 'licenses.p.royalty16' }, no, yes] },
    { use: 'licenses.p.packs', cells: [{ p: 'c', label: 'licenses.withCredit' }, no, no] },
    { use: 'licenses.p.resale', cells: [no, no, no] },
    { use: 'licenses.p.contentId', cells: [no, no, no] },
    {
      use: 'licenses.p.projects',
      cells: [
        { p: 'c', label: 'licenses.p.royalty16' },
        { p: 'c', label: 'licenses.p.royalty10' },
        { p: 'c', label: 'licenses.p.eula' },
      ],
    },
  ],
};
