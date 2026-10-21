// Поведение шапки в браузере: всплывающие окна (язык, поиск), поиск, кнопка темы, выбор языка, мобильное меню.
// Запускается на каждой странице (astro:page-load); прошлые обработчики снимаются через AbortController.
import { centerOf, currentTheme, toggleTheme } from '../../lib/theme';

type SearchItem = { title: string; meta: string; href: string; terms: string };

let abort: AbortController | undefined;

document.addEventListener('astro:page-load', () => {
  abort?.abort();
  abort = new AbortController();
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;
  const { signal } = abort;

  const mobileMenu = setupMobileMenu(header, signal);
  const closePopovers = setupPopovers(header, signal);
  setupSearch(header, signal);
  setupThemeToggle(header, signal);
  rememberLanguageChoice(header, signal);

  // Esc закрывает всё открытое.
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Escape') return;
      closePopovers();
      mobileMenu.close();
    },
    { signal },
  );
});

/** Всплывающие окна под кнопками [data-popover-toggle]. Открыто только одно; клик мимо закрывает. */
function setupPopovers(header: HTMLElement, signal: AbortSignal): () => void {
  const toggles = header.querySelectorAll<HTMLButtonElement>('[data-popover-toggle]');
  const panelOf = (b: HTMLButtonElement) =>
    header.querySelector<HTMLElement>(`[data-popover="${b.dataset.popoverToggle}"]`);
  const closeAll = (except?: HTMLButtonElement) =>
    toggles.forEach((b) => {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      panelOf(b)?.setAttribute('hidden', '');
    });

  toggles.forEach((b) =>
    b.addEventListener(
      'click',
      () => {
        const open = b.getAttribute('aria-expanded') !== 'true';
        closeAll(b);
        b.setAttribute('aria-expanded', String(open));
        const panel = panelOf(b);
        panel?.toggleAttribute('hidden', !open);
        if (open) panel?.querySelector<HTMLInputElement>('input')?.focus(); // поиск: сразу в поле
      },
      { signal },
    ),
  );
  document.addEventListener(
    'click',
    (e) => {
      if (!(e.target as Element).closest('.popover-wrap')) closeAll();
    },
    { signal },
  );
  return () => closeAll();
}

/** Поиск по названиям, жанрам и тегам. Данные — JSON в [data-search-data], собирается при сборке (Header.astro). */
function setupSearch(header: HTMLElement, signal: AbortSignal): void {
  const input = header.querySelector<HTMLInputElement>('[data-search-input]');
  const results = header.querySelector<HTMLUListElement>('[data-search-results]');
  const empty = header.querySelector<HTMLElement>('[data-search-empty]');
  if (!input || !results || !empty) return;
  const data: SearchItem[] = JSON.parse(header.querySelector('[data-search-data]')?.textContent || '[]');

  const row = (item: SearchItem) => {
    const a = document.createElement('a');
    a.href = item.href;
    const title = document.createElement('span');
    title.className = 'sr-title';
    title.textContent = item.title;
    const meta = document.createElement('span');
    meta.className = 'sr-meta';
    meta.textContent = item.meta;
    a.append(title, meta);
    const li = document.createElement('li');
    li.append(a);
    return li;
  };
  const render = () => {
    const q = input.value.trim().toLowerCase();
    // Пустой запрос — первые записи (самое новое), иначе — до 8 совпадений.
    const found = q ? data.filter((i) => i.terms.includes(q)).slice(0, 8) : data.slice(0, 6);
    results.replaceChildren(...found.map(row));
    empty.hidden = found.length > 0;
  };
  input.addEventListener('input', render, { signal });
  render();
}

/** Кнопка темы: плавное переключение (lib/theme.ts) и подпись для экранных дикторов. */
function setupThemeToggle(header: HTMLElement, signal: AbortSignal): void {
  const buttons = header.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  const syncLabel = () => {
    const dark = currentTheme() === 'dark';
    buttons.forEach((b) =>
      b.setAttribute('aria-label', (dark ? b.dataset.labelLight : b.dataset.labelDark) ?? ''),
    );
  };
  buttons.forEach((b) => b.addEventListener('click', () => toggleTheme(centerOf(b)), { signal }));
  document.addEventListener('themechange', syncLabel, { signal });
  syncLabel();
}

/** Выбранный в переключателе язык запоминается: при следующем визите сайт откроется на нём (head/language.inline.js). */
function rememberLanguageChoice(header: HTMLElement, signal: AbortSignal): void {
  header.querySelectorAll<HTMLAnchorElement>('[data-lang-link]').forEach((a) =>
    a.addEventListener(
      'click',
      () => {
        try {
          localStorage.setItem('lang', a.dataset.langLink!);
        } catch {}
      },
      { signal },
    ),
  );
}

/** Мобильное меню: кнопка ☰/✕, закрытие по ссылке. */
function setupMobileMenu(header: HTMLElement, signal: AbortSignal): { close: () => void } {
  const button = header.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = header.querySelector<HTMLElement>('[data-mobile-menu]');
  const set = (open: boolean) => {
    if (!button || !menu) return;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', (open ? button.dataset.labelClose : button.dataset.labelOpen) ?? '');
    menu.hidden = !open;
  };
  button?.addEventListener('click', () => set(button.getAttribute('aria-expanded') !== 'true'), { signal });
  menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => set(false), { signal }));
  return { close: () => set(false) };
}
