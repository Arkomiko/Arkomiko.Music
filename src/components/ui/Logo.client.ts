// Вращение логотипа (Logo variant="rotate"): 96 кадров, полный оборот за 5 секунд.
// Кадры — отдельный файл; он скачивается после загрузки страницы и только если логотип виден
// (на телефоне логотип скрыт) и в системе не включено «уменьшение движения».
// Кадры переключает таймер: за шаг меняется класс у двух элементов, а за экраном и в фоновой вкладке
// таймер спит — процессор почти не нагружен (96 CSS-анимаций прежней версии занимали его на 70%).

const FRAME_MS = 5000 / 96;
const downloads = new Map<string, Promise<string>>();
let cleanups: (() => void)[] = [];

function download(url: string): Promise<string> {
  if (!downloads.has(url))
    downloads.set(
      url,
      fetch(url).then((r) => (r.ok ? r.text() : '')),
    );
  return downloads.get(url)!;
}

async function animate(svg: SVGSVGElement): Promise<void> {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!svg.getClientRects().length) return; // логотип скрыт (телефон) — файл не нужен
  if (document.readyState !== 'complete') {
    // Сначала — всё, что нужно странице; кадры логотипа подождут.
    await new Promise((r) => addEventListener('load', r, { once: true }));
  }
  const text = await download(svg.dataset.logoRotate!).catch(() => '');
  const inner = text.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[1];
  if (!inner || !svg.isConnected) return;
  svg.innerHTML = inner; // свой файл из сборки, первый кадр в нём совпадает с уже показанным

  const frames = svg.querySelectorAll('.lr-f');
  let i = 0;
  let timer = 0;
  let onScreen = true;
  const step = () => {
    frames[i].classList.remove('on');
    i = (i + 1) % frames.length;
    frames[i].classList.add('on');
  };
  const run = () => {
    if (!timer && onScreen && !document.hidden) timer = window.setInterval(step, FRAME_MS);
  };
  const stop = () => {
    clearInterval(timer);
    timer = 0;
  };
  const observer = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) run();
    else stop();
  });
  observer.observe(svg);
  const onVisibility = () => (document.hidden ? stop() : run());
  document.addEventListener('visibilitychange', onVisibility);
  cleanups.push(() => {
    stop();
    observer.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
  });
  run();
}

document.addEventListener('astro:page-load', () => {
  document.querySelectorAll<SVGSVGElement>('svg[data-logo-rotate]').forEach((svg) => void animate(svg));
});
// Уход со страницы (ClientRouter): остановить таймеры старой страницы.
document.addEventListener('astro:before-swap', () => {
  cleanups.forEach((c) => c());
  cleanups = [];
});
