// «Последние релизы» в браузере: фильтр по типу (Все / Синглы / Альбомы / Каверы / Материалы)
// и кнопка «Все релизы». На компьютере видно 5 карточек, на телефоне — 4.

const mobile = matchMedia('(max-width: 767px)');
// Обработчик смены ширины экрана висит на общем matchMedia — при уходе со страницы его снимаем,
// иначе с каждым переходом их становилось бы больше.
let abort: AbortController | undefined;

function setupReleases() {
  abort?.abort();
  abort = new AbortController();
  const { signal } = abort;

  document.querySelectorAll<HTMLElement>('[data-releases]').forEach((root) => {
    const buttons = root.querySelectorAll<HTMLButtonElement>('[data-filter]');
    const cards = [...root.querySelectorAll<HTMLElement>('[data-cat]')];
    const empty = root.querySelector<HTMLElement>('[data-empty]')!;
    const more = root.querySelector<HTMLButtonElement>('[data-more]')!;
    let filter = 'all';
    let expanded = false;

    const apply = () => {
      const limit = expanded ? Infinity : mobile.matches ? 4 : 5;
      const matching = cards.filter((c) => filter === 'all' || c.dataset.cat === filter);
      cards.forEach((c) => (c.hidden = true));
      matching.slice(0, limit).forEach((c) => (c.hidden = false));
      empty.hidden = matching.length > 0;
      more.hidden = matching.length <= limit;
    };
    buttons.forEach((b) =>
      b.addEventListener('click', () => {
        buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        filter = b.dataset.filter!;
        apply();
      }),
    );
    more.addEventListener('click', () => {
      expanded = true;
      apply();
    });
    mobile.addEventListener('change', apply, { signal });
    apply();
  });
}

document.addEventListener('astro:page-load', setupReleases);
