// Язык при первом открытии сайта. Встраивается в <head> до отрисовки (Base.astro); при сборке вместо
// заглушек в двойных подчёркиваниях подставляются коды всех языков из languages/ и основной язык.
//
// • Посетитель выбрал язык в переключателе (localStorage 'lang') — открываем его.
// • Не выбирал — берём первый подходящий из языков браузера (navigator.languages), даже если перевод
//   ещё не готов. Ни один не подошёл — английский.
// • Адрес уже с кодом языка (/en/…, /de/…) — не трогаем: так открывают ссылки, которыми поделились.
// • Поисковых роботов не перенаправляем, иначе они не увидят русские страницы.
(() => {
  if (window.__arkomikoLang) return; // при переходах между страницами — не запускать повторно
  window.__arkomikoLang = true;

  const LANGS = __LANGS__;
  const DEFAULT = __DEFAULT__;
  const FALLBACK = 'en';
  const ALIASES = { fil: 'tl' }; // браузеры называют тагальский filipino

  if (navigator.webdriver || /bot|crawl|spider|slurp|lighthouse|headless/i.test(navigator.userAgent)) return;

  const path = location.pathname;
  const first = path.split('/')[1];
  if (first !== DEFAULT && LANGS.includes(first)) return;

  let lang = null;
  try {
    lang = localStorage.getItem('lang');
  } catch {}
  if (!LANGS.includes(lang)) {
    lang = FALLBACK;
    for (const tag of navigator.languages ?? [navigator.language]) {
      const full = String(tag).toLowerCase();
      const base = full.split('-')[0];
      const match = LANGS.includes(full) ? full : LANGS.includes(base) ? base : ALIASES[base];
      if (match) {
        lang = match;
        break;
      }
    }
  }
  if (lang === DEFAULT) return;
  location.replace(`/${lang}${path === '/' ? '' : path}${location.search}${location.hash}`);
})();
