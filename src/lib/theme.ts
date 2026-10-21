// Тема сайта: тёмная или светлая. Работает в браузере (кнопки в шапке и в полноэкранном плеере).
// Выбор посетителя хранится в localStorage; пока выбора нет, сайт следует теме системы —
// это делает скрипт layouts/head/theme.inline.js ещё до первой отрисовки страницы.

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'theme';
const DURATION = 550; // мс, раскрытие новой темы

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/** Переключить тему. origin — точка нажатия: из неё новая тема раскрывается кругом. */
export function toggleTheme(origin?: { x: number; y: number }): void {
  setTheme(currentTheme() === 'light' ? 'dark' : 'light', origin);
}

export function setTheme(next: Theme, origin?: { x: number; y: number }): void {
  const root = document.documentElement;
  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    // Слушают шапка (подпись кнопки), плеер, спектрометр и иконка вкладки.
    document.dispatchEvent(new CustomEvent('themechange'));
  };

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();

  // Chrome, Edge, Safari 18+: снимок старой темы, поверх — новая, раскрывается кругом от кнопки.
  if (document.startViewTransition) {
    const x = origin?.x ?? innerWidth / 2;
    const y = origin?.y ?? 0;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add('theme-switching');
    const transition = document.startViewTransition(apply);
    transition.ready
      .then(() =>
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: DURATION,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        ),
      )
      .catch(() => {});
    transition.finished.finally(() => root.classList.remove('theme-switching'));
    return;
  }

  // Остальные браузеры: цвета плавно перетекают (styles/theme-transition.css).
  root.classList.add('theme-fade');
  apply();
  setTimeout(() => root.classList.remove('theme-fade'), 400);
}

/** Центр элемента — для круга, который расходится от нажатой кнопки. */
export function centerOf(el: Element): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
