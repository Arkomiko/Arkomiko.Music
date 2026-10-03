// Анализатор спектра для плеера (Web Audio API). Один на весь сайт: аудио-элемент плеера живёт всё время,
// а подключить его к AudioContext можно только один раз.

let ctx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;

/**
 * Подключает аудио плеера к анализатору. Вызывать при старте воспроизведения (по действию пользователя).
 * Если браузер не дал запустить AudioContext, звук не перехватываем — иначе музыка бы замолчала.
 */
export async function connectSpectrum(audio: HTMLAudioElement): Promise<void> {
  if (ctx) {
    if (ctx.state === 'suspended') await ctx.resume().catch(() => {});
    return;
  }
  const AC: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  const c = new AC();
  await c.resume().catch(() => {});
  if (c.state !== 'running') {
    c.close().catch(() => {});
    return;
  }
  const source = c.createMediaElementSource(audio);
  const node = c.createAnalyser();
  // 4096 → 2048 частотных отсчётов (~12 Гц каждый): хватает на 252 полосы даже в басах.
  node.fftSize = 4096;
  node.smoothingTimeConstant = 0.72;
  node.minDecibels = -88;
  node.maxDecibels = -22;
  source.connect(node);
  node.connect(c.destination);
  ctx = c;
  analyser = node;
}

export function getAnalyser(): AnalyserNode | null {
  return analyser;
}
