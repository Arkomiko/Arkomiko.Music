// «Лицензии» в браузере: кнопка «Скопировать» у образца подписи (TASL).
function setupCopy() {
  const btn = document.querySelector<HTMLButtonElement>('[data-copy]');
  const text = document.querySelector('[data-credit]')?.textContent ?? '';
  btn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = btn.dataset.done ?? '';
      setTimeout(() => (btn.textContent = btn.dataset.label ?? ''), 1600);
    } catch {}
  });
}
document.addEventListener('astro:page-load', setupCopy);
