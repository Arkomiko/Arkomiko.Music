<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { $current, $playing, $request, $queue, $index, toggle, next, prev } from '../stores/player';

const current = useStore($current);
const playing = useStore($playing);
const request = useStore($request);
const queue = useStore($queue);
const index = useStore($index);

const audio = ref<HTMLAudioElement | null>(null);
const time = ref(0);
const duration = ref(0);
const volume = ref(0.8);

const hasPrev = computed(() => index.value > 0);
const hasNext = computed(() => index.value < queue.value.length - 1);

onMounted(() => {
  try {
    const v = localStorage.getItem('player-volume');
    if (v !== null) volume.value = Number(v);
  } catch {}
  if (audio.value) audio.value.volume = volume.value;
});

// Новый запрос на воспроизведение: меняем источник и играем.
watch(request, async () => {
  const a = audio.value;
  const t = current.value;
  if (!a || !t) return;
  a.src = t.src;
  time.value = 0;
  duration.value = t.duration;
  updateMediaSession();
  try {
    await a.play();
  } catch {
    $playing.set(false);
  }
});

watch(playing, async (p) => {
  const a = audio.value;
  if (!a || !a.src) return;
  if (p && a.paused) {
    try {
      await a.play();
    } catch {
      $playing.set(false);
    }
  } else if (!p && !a.paused) {
    a.pause();
  }
});

watch(volume, (v) => {
  if (audio.value) audio.value.volume = v;
  try {
    localStorage.setItem('player-volume', String(v));
  } catch {}
});

function setPlaying(v: boolean) {
  if ($playing.get() !== v) $playing.set(v);
}

function onSeek(e: Event) {
  const v = Number((e.target as HTMLInputElement).value);
  if (audio.value) audio.value.currentTime = v;
  time.value = v;
}

function onPrev() {
  // Как в большинстве плееров: если трек уже играет несколько секунд — в его начало.
  if (audio.value && audio.value.currentTime > 3) {
    audio.value.currentTime = 0;
    return;
  }
  prev();
}

function fmt(s: number) {
  if (!s || !isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function updateMediaSession() {
  const t = current.value;
  if (!t || !('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: t.title,
    artist: t.artist,
    album: t.release,
    artwork: t.cover ? [{ src: t.cover, sizes: '160x160' }] : [],
  });
  navigator.mediaSession.setActionHandler('play', () => $playing.set(true));
  navigator.mediaSession.setActionHandler('pause', () => $playing.set(false));
  navigator.mediaSession.setActionHandler('previoustrack', onPrev);
  navigator.mediaSession.setActionHandler('nexttrack', next);
}
</script>

<template>
  <div
    class="player"
    :class="{ 'is-visible': !!current }"
    :style="current ? { '--accent': current.accent } : {}"
  >
    <audio
      ref="audio"
      preload="none"
      @timeupdate="time = ($event.target as HTMLAudioElement).currentTime"
      @loadedmetadata="duration = ($event.target as HTMLAudioElement).duration"
      @play="setPlaying(true)"
      @pause="setPlaying(false)"
      @ended="next()"
    />
    <template v-if="current">
      <a class="now" :href="current.href">
        <img v-if="current.cover" :src="current.cover" alt="" width="48" height="48" />
        <span class="now-text">
          <span class="now-title">{{ current.title }}</span>
          <span class="now-release">{{ current.release }}</span>
        </span>
      </a>

      <div class="controls">
        <button
          type="button"
          class="icon"
          :disabled="!hasPrev && time < 3"
          aria-label="Предыдущий трек"
          @click="onPrev"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2v14H6zM20 5v14L9 12z" /></svg>
        </button>
        <button type="button" class="icon main" :aria-label="playing ? 'Пауза' : 'Слушать'" @click="toggle()">
          <svg v-if="playing" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15L20 12z" /></svg>
        </button>
        <button type="button" class="icon" :disabled="!hasNext" aria-label="Следующий трек" @click="next()">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 5h2v14h-2zM4 5v14l11-7z" /></svg>
        </button>
      </div>

      <div class="progress">
        <span class="time">{{ fmt(time) }}</span>
        <input
          type="range"
          min="0"
          :max="duration || 0"
          step="0.1"
          :value="time"
          :style="{ '--p': duration ? (time / duration) * 100 + '%' : '0%' }"
          aria-label="Позиция в треке"
          @input="onSeek"
        />
        <span class="time">{{ fmt(duration) }}</span>
      </div>

      <label class="volume">
        <span class="visually-hidden">Громкость</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 9h4l5-4v14l-5-4H4zM16 8.5a5 5 0 0 1 0 7"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          />
        </svg>
        <input
          v-model.number="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          :style="{ '--p': volume * 100 + '%' }"
        />
      </label>
    </template>
  </div>
</template>

<style scoped>
.player {
  position: fixed;
  inset: auto 0 0 0;
  z-index: 50;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1.4fr) auto;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem clamp(1rem, 3vw, 2rem);
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px));
  background: color-mix(in oklab, var(--bg) 88%, var(--accent) 12%);
  border-top: 2px solid var(--accent);
  transform: translateY(100%);
  visibility: hidden;
  transition:
    transform 0.35s ease,
    visibility 0s linear 0.35s;
}
.player.is-visible {
  transform: none;
  visibility: visible;
  transition: transform 0.35s ease;
}
@media (prefers-reduced-motion: reduce) {
  .player {
    transition: none;
  }
}

.now {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}
.now img {
  width: 48px;
  height: 48px;
  object-fit: cover;
  flex: none;
}
.now-text {
  display: grid;
  min-width: 0;
}
.now-title {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.now-release {
  color: var(--muted);
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.now:hover .now-title {
  color: var(--accent);
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--text);
  cursor: pointer;
}
.icon svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
.icon:disabled {
  opacity: 0.35;
  cursor: default;
}
.icon.main {
  width: 46px;
  height: 46px;
  background: var(--accent);
  color: var(--bg);
}
.icon:not(.main):not(:disabled):hover {
  color: var(--accent);
}

.progress {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}
.time {
  font-variant-numeric: tabular-nums;
  font-size: 0.8125rem;
  color: var(--muted);
  min-width: 2.6em;
}
.progress input {
  flex: 1;
}

.volume {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--muted);
}
.volume svg {
  width: 20px;
  height: 20px;
}
.volume input {
  width: 96px;
}

input[type='range'] {
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(to right, var(--accent) var(--p, 0%), var(--line) var(--p, 0%));
  cursor: pointer;
}
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--text);
}
input[type='range']::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border: 0;
  border-radius: 50%;
  background: var(--text);
}

@media (max-width: 760px) {
  .player {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.5rem 1rem;
  }
  .progress {
    grid-column: 1 / -1;
    order: 3;
  }
  .volume {
    display: none;
  }
}
</style>
