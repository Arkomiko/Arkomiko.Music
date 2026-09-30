// Общее состояние плеера. Его читают и плеер внизу страницы, и кнопки «Слушать» на страницах.
import { atom, computed } from 'nanostores';

export type PlayerTrack = {
  src: string;
  title: string;
  artist: string;
  release: string;
  href: string;
  cover?: string;
  accent: string;
  duration: number;
};

export const $queue = atom<PlayerTrack[]>([]);
export const $index = atom(0);
export const $playing = atom(false);
/** Увеличивается при каждом запросе «играть с начала», чтобы плеер перезапускал трек. */
export const $request = atom(0);

export const $current = computed([$queue, $index], (q, i) => q[i]);

export function playQueue(tracks: PlayerTrack[], start = 0) {
  if (!tracks.length) return;
  const current = $current.get();
  // Тот же трек уже выбран — просто пауза/продолжение.
  if (current && current.src === tracks[start]?.src) {
    $playing.set(!$playing.get());
    return;
  }
  $queue.set(tracks);
  $index.set(start);
  $playing.set(true);
  $request.set($request.get() + 1);
}

export function toggle() {
  if ($current.get()) $playing.set(!$playing.get());
}

export function next() {
  const q = $queue.get();
  if ($index.get() < q.length - 1) {
    $index.set($index.get() + 1);
    $playing.set(true);
    $request.set($request.get() + 1);
  } else {
    $playing.set(false);
  }
}

export function prev() {
  if ($index.get() > 0) {
    $index.set($index.get() - 1);
    $playing.set(true);
    $request.set($request.get() + 1);
  }
}
