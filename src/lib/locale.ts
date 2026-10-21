// Адреса страниц на разных языках. Без словарей, поэтому модуль можно подключать и в браузере (плеер, таблицы).
// Основной язык живёт в корне (/about), остальные — под своим кодом (/en/about, /de/about).

export const defaultLang = 'ru';

/** Ссылка на странице нужного языка: ('/about', 'en') → '/en/about', ('/#tracks', 'en') → '/en#tracks' */
export function localize(href: string, lang: string): string {
  if (lang === defaultLang || /^(https?:|mailto:)/.test(href)) return href;
  if (href === '/') return `/${lang}`;
  if (href.startsWith('/#')) return `/${lang}${href.slice(1)}`;
  return `/${lang}${href}`;
}
