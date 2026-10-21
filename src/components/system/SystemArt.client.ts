// Safari проигрывает WEBM, но без прозрачности — там вместо видео показываем SVG.
function useFallbackInSafari() {
  const ua = navigator.userAgent;
  const safari = /Safari\//.test(ua) && !/Chrome\/|Chromium\/|Edg\/|OPR\/|Android/.test(ua);
  if (!safari) return;
  document
    .querySelectorAll<HTMLElement>('[data-system-art]')
    .forEach((root) => root.classList.add('no-alpha'));
}
document.addEventListener('astro:page-load', useFallbackInSafari);
