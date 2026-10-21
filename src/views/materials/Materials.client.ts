// «Материалы» в браузере: фильтр паков по типу (Сэмплы / Пресеты / Проекты / Коллекции).
function setupPacks() {
  const root = document.querySelector<HTMLElement>('[data-packs]');
  if (!root) return;
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-filter]');
  const cards = [...root.querySelectorAll<HTMLElement>('[data-cat]')];
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  buttons.forEach((b) =>
    b.addEventListener('click', () => {
      buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.filter;
      let shown = 0;
      cards.forEach((c) => {
        c.hidden = f !== 'all' && c.dataset.cat !== f;
        if (!c.hidden) shown++;
      });
      empty.hidden = !cards.length || shown > 0;
    }),
  );
}
document.addEventListener('astro:page-load', setupPacks);
