// Тема до первой отрисовки, чтобы страница не мигала. Встраивается в <head> как есть (Base.astro).
// Выбор посетителя (localStorage 'theme') важнее системы; пока выбора нет — тема как в системе,
// и если в системе её сменить, сайт плавно переключится следом.
(() => {
  if (window.__arkomikoTheme) return; // при переходах между страницами скрипт не запускается второй раз
  window.__arkomikoTheme = true;

  const system = matchMedia('(prefers-color-scheme: light)');
  const saved = () => {
    try {
      const t = localStorage.getItem('theme');
      return t === 'light' || t === 'dark' ? t : null;
    } catch {
      return null;
    }
  };
  const pick = () => saved() ?? (system.matches ? 'light' : 'dark');

  // Иконка вкладки: в тёмной теме — светлая лиса, в светлой — тёмная.
  const setIcon = (doc) => {
    const icon = doc.querySelector('link[data-theme-icon]');
    if (icon) icon.href = `/favicon-${doc.documentElement.dataset.theme}.ico`;
  };
  const apply = (doc) => {
    doc.documentElement.dataset.theme = pick();
    setIcon(doc);
  };

  apply(document);
  // Переход на другую страницу (ClientRouter): тема ставится новой странице до показа.
  document.addEventListener('astro:before-swap', (e) => apply(e.newDocument));
  // Тему переключили кнопкой — обновить иконку вкладки.
  document.addEventListener('themechange', () => setIcon(document));
  // Тему сменили в системе, а на сайте её не выбирали — плавно переключиться.
  system.addEventListener('change', () => {
    if (saved()) return;
    const root = document.documentElement;
    root.classList.add('theme-fade');
    apply(document);
    document.dispatchEvent(new CustomEvent('themechange'));
    setTimeout(() => root.classList.remove('theme-fade'), 400);
  });
})();
