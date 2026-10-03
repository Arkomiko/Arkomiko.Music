// Общее состояние плеера. Его читают нижний плеер и все кнопки «Играть» на страницах.
import { atom, computed } from 'nanostores';

export type PlayerTrack = {
  id: string; // 001
  src: string;
  file: string;
  title: string;
  artist: string;
  release: string;
  kind: 'single' | 'album' | 'ep' | 'cover' | 'techno-demo' | 'samples';
  href: string; // без языкового префикса
  cover?: string; // миниатюра 112 px
  coverLarge?: string; // 720 px для полноэкранного плеера
  duration: number;
  genre?: string;
  bpm?: number;
  status: 'released' | 'prerelease' | 'draft';
  download: boolean;
};

export const $queue = atom<PlayerTrack[]>([]);
export const $index = atom(0);
export const $playing = atom(false);
export const $shuffle = atom(false);
export const $repeat = atom(false); // повтор текущего трека
/** Увеличивается при каждом запросе «играть с начала», чтобы плеер перезапускал трек. */
export const $request = atom(0);

export const $current = computed([$queue, $index], (q, i) => q[i] as PlayerTrack | undefined);
export const $upNext = computed([$queue, $index, $shuffle], (q, i, s) =>
  s || q.length < 2 ? undefined : q[(i + 1) % q.length],
);

/** Первое заполнение очереди (без автозапуска), чтобы плеер сразу показывал трек. */
export function initQueue(tracks: PlayerTrack[]) {
  if (!$queue.get().length && tracks.length) $queue.set(tracks);
}

function start(i: number) {
  $index.set(i);
  // Сначала запрос на загрузку, потом флаг «играет»: плеер грузит трек один раз.
  $request.set($request.get() + 1);
  $playing.set(true);
}

export function playQueue(tracks: PlayerTrack[], i = 0) {
  if (!tracks.length) return;
  const current = $current.get();
  // Тот же трек уже выбран — просто пауза/продолжение.
  if (current && current.src === tracks[i]?.src) {
    toggle();
    return;
  }
  $queue.set(tracks);
  start(i);
}

export function toggle() {
  if ($current.get()) $playing.set(!$playing.get());
}

function randomIndex() {
  const n = $queue.get().length;
  if (n < 2) return 0;
  let i = $index.get();
  while (i === $index.get()) i = Math.floor(Math.random() * n);
  return i;
}

export function next() {
  const n = $queue.get().length;
  if (!n) return;
  start($shuffle.get() ? randomIndex() : ($index.get() + 1) % n);
}

export function prev() {
  const n = $queue.get().length;
  if (!n) return;
  start(($index.get() - 1 + n) % n);
}

/** Трек доиграл: повтор → снова он; иначе следующий, а после последнего — стоп. */
export function ended() {
  if ($repeat.get()) start($index.get());
  else if ($shuffle.get() || $index.get() < $queue.get().length - 1) next();
  else $playing.set(false);
}
