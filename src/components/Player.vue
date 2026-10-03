<script setup lang="ts">
// Один плеер на весь сайт. Живёт в Base.astro с transition:persist, поэтому не прерывается при переходах.
// Десктоп — панель 96 px внизу; мобильный — плавающая карточка, по нажатию — полноэкранный плеер.
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useStore } from '@nanostores/vue';
import Icon from './Icon.vue';
import Spectrum from './Spectrum.vue';
import { connectSpectrum } from '../lib/spectrum';
import {
  $current,
  $playing,
  $request,
  $index,
  $queue,
  $shuffle,
  $repeat,
  $upNext,
  initQueue,
  toggle,
  next,
  prev,
  ended,
  type PlayerTrack,
} from '../stores/player';
import { ui, isLang, defaultLang, localize, type Lang } from '../i18n';

const props = defineProps<{ library: PlayerTrack[] }>();

const stored = useStore($current);
const playing = useStore($playing);
const request = useStore($request);
const shuffle = useStore($shuffle);
const repeat = useStore($repeat);
const upNext = useStore($upNext);
// До первого запуска показываем самый новый трек (так же и при серверной отрисовке).
const current = computed(() => stored.value ?? props.library[0]);

const audio = ref<HTMLAudioElement | null>(null);
const time = ref(0);
const duration = ref(0);
const volume = ref(0.8);
const expanded = ref(false);
const isLight = ref(false);
const syncTheme = () => (isLight.value = document.documentElement.dataset.theme === 'light');

// Плеер не перерисовывается при переходах, поэтому язык берём из <html lang> сами.
const lang = ref<Lang>(defaultLang);
const t = computed(() => ui[lang.value]);
const syncLang = () => {
  const l = document.documentElement.lang;
  lang.value = isLang(l) ? l : defaultLang;
};

const dur = computed(() => duration.value || current.value?.duration || 0);
const progress = computed(() => (dur.value ? Math.min(100, (time.value / dur.value) * 100) : 0));
const href = computed(() => (current.value ? localize(current.value.href, lang.value) : '#'));
const kindLabel = computed(() => (current.value ? t.value[`kind.${current.value.kind}`] : ''));

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') expanded.value = false;
}

onMounted(() => {
  initQueue(props.library);
  syncLang();
  syncTheme();
  document.addEventListener('astro:after-swap', syncLang);
  document.addEventListener('themechange', syncTheme);
  document.addEventListener('keydown', onKey);
  try {
    const v = localStorage.getItem('player-volume');
    if (v !== null) volume.value = Number(v);
  } catch {}
  if (audio.value) audio.value.volume = volume.value;
});
onBeforeUnmount(() => {
  document.removeEventListener('astro:after-swap', syncLang);
  document.removeEventListener('themechange', syncTheme);
  document.removeEventListener('keydown', onKey);
});

function load(track: PlayerTrack) {
  const a = audio.value;
  if (!a) return;
  a.src = track.src;
  time.value = 0;
  duration.value = track.duration;
  updateMediaSession(track);
}

async function play() {
  try {
    await audio.value?.play();
  } catch (e) {
    // AbortError — play() прервали новой загрузкой или паузой, это не ошибка.
    if ((e as DOMException).name !== 'AbortError') $playing.set(false);
  }
}

// Новый запрос «играть с начала»: меняем источник и играем.
watch(request, () => {
  const tr = current.value;
  if (!tr) return;
  load(tr);
  play();
});

watch(playing, (p) => {
  const a = audio.value;
  const tr = current.value;
  if (!a || !tr) return;
  if (p) {
    if (!a.src) load(tr); // первый запуск трека, показанного по умолчанию
    if (a.paused) play();
  } else if (!a.paused) a.pause();
});

watch(volume, (v) => {
  if (audio.value) audio.value.volume = v;
  try {
    localStorage.setItem('player-volume', String(v));
  } catch {}
});

watch(expanded, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : '';
});

function setPlaying(v: boolean) {
  if ($playing.get() !== v) $playing.set(v);
}

function onPlay() {
  setPlaying(true);
  if (audio.value) connectSpectrum(audio.value);
}

function onSeek(e: Event) {
  const v = Number((e.target as HTMLInputElement).value);
  if (audio.value && audio.value.src) audio.value.currentTime = v;
  time.value = v;
}

function onPrev() {
  // Как в большинстве плееров: если трек играет больше трёх секунд — в его начало.
  if (audio.value && audio.value.currentTime > 3) {
    audio.value.currentTime = 0;
    return;
  }
  prev();
}

function toggleTheme() {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = nextTheme;
  try {
    localStorage.setItem('theme', nextTheme);
  } catch {}
  document.dispatchEvent(new CustomEvent('themechange'));
}

function fmt(s: number) {
  if (!s || !isFinite(s)) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function updateMediaSession(tr: PlayerTrack) {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: tr.title,
    artist: tr.artist,
    album: tr.release,
    artwork: tr.coverLarge ? [{ src: tr.coverLarge, sizes: '720x720' }] : [],
  });
  navigator.mediaSession.setActionHandler('play', () => $playing.set(true));
  navigator.mediaSession.setActionHandler('pause', () => $playing.set(false));
  navigator.mediaSession.setActionHandler('previoustrack', onPrev);
  navigator.mediaSession.setActionHandler('nexttrack', next);
}
</script>

<template>
  <div v-if="current" class="player" :class="{ 'is-playing': playing }">
    <audio
      ref="audio"
      preload="none"
      @timeupdate="time = ($event.target as HTMLAudioElement).currentTime"
      @loadedmetadata="duration = ($event.target as HTMLAudioElement).duration"
      @play="onPlay"
      @pause="setPlaying(false)"
      @ended="ended()"
    />

    <!-- Десктоп -->
    <div class="bar">
      <!-- Левая и правая колонки одинаковой ширины: кнопки и шкала времени всегда точно по центру экрана. -->
      <div class="left">
        <a class="now" :href="href">
          <img v-if="current.cover" :src="current.cover" alt="" width="56" height="56" />
          <span v-else class="now-cover-empty" />
          <span class="now-text">
            <span class="now-title">{{ current.title }}</span>
            <span class="now-artist">{{ current.artist }}</span>
          </span>
        </a>

        <div class="spec">
          <Spectrum :playing="playing" />
        </div>
      </div>

      <div class="center">
        <input
          class="range progress"
          type="range"
          min="0"
          :max="dur"
          step="0.1"
          :value="time"
          :style="{ '--p': progress + '%' }"
          :aria-label="t['player.seek']"
          @input="onSeek"
        />
        <div class="center-row">
          <span class="time">{{ fmt(time) }}</span>
          <div class="controls">
            <button type="button" class="ctrl" :aria-label="t['player.prev']" @click="onPrev">
              <Icon name="prev" />
            </button>
            <button
              type="button"
              class="ctrl main"
              :aria-label="playing ? t['player.pause'] : t['player.play']"
              @click="toggle()"
            >
              <Icon :name="playing ? 'pause' : 'play'" />
            </button>
            <button type="button" class="ctrl" :aria-label="t['player.next']" @click="next()">
              <Icon name="next" />
            </button>
          </div>
          <span class="time end">{{ fmt(dur) }}</span>
        </div>
      </div>

      <label class="volume">
        <Icon name="volume" />
        <span class="visually-hidden">{{ t['player.volume'] }}</span>
        <input
          v-model.number="volume"
          class="range vol"
          type="range"
          min="0"
          max="1"
          step="0.01"
          :style="{ '--p': volume * 100 + '%' }"
        />
      </label>
    </div>

    <!-- Мобильный: мини-плеер -->
    <div class="mini">
      <span class="mini-progress"><span :style="{ width: progress + '%' }" /></span>
      <button type="button" class="mini-open" :aria-label="t['player.expand']" @click="expanded = true">
        <img v-if="current.cover" :src="current.cover" alt="" width="40" height="40" />
        <span v-else class="mini-cover-empty" />
        <span class="mini-text">
          <span class="mini-title">{{ current.title }}</span>
          <span class="mini-sub">{{ current.artist }} · {{ fmt(dur) }}</span>
        </span>
      </button>
      <button
        type="button"
        class="mini-play"
        :aria-label="playing ? t['player.pause'] : t['player.play']"
        @click="toggle()"
      >
        <Icon :name="playing ? 'pause' : 'play'" :size="14" />
      </button>
    </div>

    <!-- Мобильный: полноэкранный плеер -->
    <div v-if="expanded" class="full" role="dialog" aria-modal="true" :aria-label="t['player.nowPlaying']">
      <div class="full-top">
        <button type="button" class="full-icon" :aria-label="t['player.collapse']" @click="expanded = false">
          <Icon name="chevronDown" :size="22" />
        </button>
        <div class="full-eyebrow">{{ t['player.nowPlaying'] }}</div>
        <button
          type="button"
          class="full-icon theme"
          :aria-label="isLight ? t['theme.toDark'] : t['theme.toLight']"
          @click="toggleTheme"
        >
          <Icon :name="isLight ? 'moon' : 'sun'" :size="20" />
        </button>
      </div>

      <img v-if="current.coverLarge" class="full-cover" :src="current.coverLarge" alt="" />
      <div v-else class="full-cover cover-placeholder" />

      <div class="full-titles">
        <div class="full-title">{{ current.title }}</div>
        <div class="full-sub"><span class="logo-name">Arkomiko</span> · {{ kindLabel }}</div>
      </div>

      <div class="full-spec">
        <Spectrum :playing="playing" />
      </div>

      <div class="full-progress">
        <input
          class="range progress"
          type="range"
          min="0"
          :max="dur"
          step="0.1"
          :value="time"
          :style="{ '--p': progress + '%' }"
          :aria-label="t['player.seek']"
          @input="onSeek"
        />
        <div class="full-times">
          <span>{{ fmt(time) }}</span
          ><span>{{ fmt(dur) }}</span>
        </div>
      </div>

      <div class="full-controls">
        <button
          type="button"
          class="full-icon side"
          :class="{ on: shuffle }"
          :aria-pressed="shuffle"
          :aria-label="t['player.shuffle']"
          @click="$shuffle.set(!shuffle)"
        >
          <Icon name="shuffle" :size="20" />
        </button>
        <button type="button" class="full-icon big" :aria-label="t['player.prev']" @click="onPrev">
          <Icon name="prev" :size="24" />
        </button>
        <button
          type="button"
          class="full-play"
          :aria-label="playing ? t['player.pause'] : t['player.play']"
          @click="toggle()"
        >
          <Icon :name="playing ? 'pause' : 'play'" :size="26" />
        </button>
        <button type="button" class="full-icon big" :aria-label="t['player.next']" @click="next()">
          <Icon name="next" :size="24" />
        </button>
        <button
          type="button"
          class="full-icon side"
          :class="{ on: repeat }"
          :aria-pressed="repeat"
          :aria-label="t['player.repeat']"
          @click="$repeat.set(!repeat)"
        >
          <Icon name="repeat" :size="20" />
        </button>
      </div>

      <div class="full-bottom">
        <div class="full-next">
          <template v-if="upNext">
            <div class="full-next-label">{{ t['player.upNext'] }}</div>
            <div class="full-next-title">{{ upNext.title }}</div>
          </template>
        </div>
        <a class="full-license" :href="href" @click="expanded = false">{{ t['player.license'] }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Дорожки прогресса и громкости */
.range {
  -webkit-appearance: none;
  appearance: none;
  display: block;
  width: 100%;
  margin: 0;
  background: linear-gradient(to right, var(--fill) var(--p, 0%), var(--track) var(--p, 0%));
  border-radius: 2px;
  cursor: pointer;
}
.progress {
  --fill: var(--accent);
  height: 4px;
}
.vol {
  --fill: var(--text);
  width: 96px;
  height: 3px;
}
.range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--fill);
  opacity: 0;
}
.range::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: 0;
  border-radius: 50%;
  background: var(--fill);
  opacity: 0;
}
.range:hover::-webkit-slider-thumb,
.range:focus-visible::-webkit-slider-thumb {
  opacity: 1;
}
.range:hover::-moz-range-thumb,
.range:focus-visible::-moz-range-thumb {
  opacity: 1;
}

/* Десктоп */
.bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 520px) minmax(0, 1fr);
  gap: 28px;
  align-items: center;
  height: 96px;
  padding: 0 28px;
  border-top: 1px solid var(--line);
  background: var(--surface);
}
.left {
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;
}
.now {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 0 1 auto;
  min-width: 0;
  max-width: 210px;
}
.now img,
.now-cover-empty {
  width: 56px;
  height: 56px;
  flex: none;
  object-fit: cover;
  border-radius: 3px;
  background: var(--surface-2);
}
.now-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.now-title {
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.now-artist {
  font-size: 13px;
  color: var(--muted);
}
.spec {
  flex: 1 1 0;
  min-width: 0;
  max-width: 440px;
  height: 52px;
}
.center {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  justify-self: center;
}
.center-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
}
.time {
  width: 40px;
}
.time.end {
  text-align: right;
}
.controls {
  display: flex;
  align-items: center;
  gap: 16px;
}
.ctrl {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 22px;
  background: transparent;
  color: var(--text);
  cursor: pointer;
}
.ctrl.main {
  background: var(--accent);
  color: var(--on-accent);
}
.volume {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  color: var(--muted);
}

/* Мобильный мини-плеер */
.mini {
  display: none;
}

@media (max-width: 1199px) {
  .bar {
    grid-template-columns: minmax(0, 1fr) minmax(0, 400px) minmax(0, 1fr);
    gap: 20px;
    padding: 0 20px;
  }
  .now {
    max-width: 170px;
  }
  .vol {
    width: 72px;
  }
}
@media (max-width: 959px) {
  .spec {
    display: none;
  }
}

@media (max-width: 767px) {
  .bar {
    display: none;
  }
  .mini {
    position: fixed;
    left: 7px;
    right: 7px;
    bottom: 7px;
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 11px;
    height: 56px;
    padding: 0 7px 0 9px;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 11px;
    background: var(--surface);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }
  .mini-progress {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 2px;
    background: var(--track);
  }
  .mini-progress span {
    display: block;
    height: 100%;
    background: var(--accent);
  }
  .mini-open {
    display: flex;
    align-items: center;
    gap: 11px;
    flex-grow: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }
  .mini-open img,
  .mini-cover-empty {
    width: 40px;
    height: 40px;
    flex: none;
    object-fit: cover;
    border-radius: 4px;
    background: var(--surface-2);
  }
  .mini-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .mini-title {
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mini-sub {
    font-size: 11px;
    color: var(--muted);
  }
  .mini-play {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 40px;
    height: 40px;
    border: 0;
    border-radius: 20px;
    background: var(--accent);
    color: var(--on-accent);
    cursor: pointer;
  }
}

/* Полноэкранный плеер */
.full {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px 24px 32px;
  overflow-y: auto;
  background: var(--bg);
  color: var(--text);
}
.full-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.full-eyebrow,
.full-next-label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}
.full-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  cursor: pointer;
}
.full-icon.side {
  color: var(--muted);
}
.full-icon.side.on {
  color: var(--accent-ink);
}
.full-icon.big {
  width: 52px;
  height: 52px;
}
.full-cover {
  width: 100%;
  max-width: min(100%, 48vh);
  aspect-ratio: 1;
  align-self: center;
  object-fit: cover;
  border-radius: 4px;
}
.full-titles {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.full-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 24px;
  line-height: 1.05;
  text-transform: uppercase;
}
.full-sub {
  font-size: 15px;
  color: var(--muted);
}
.full-sub .logo-name {
  color: var(--text);
}
.full-spec {
  height: 64px;
}
.full-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.full-times {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
}
.full-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
}
.full-play {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border: 0;
  border-radius: 36px;
  background: var(--accent);
  color: var(--on-accent);
  cursor: pointer;
}
.full-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}
.full-next {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.full-next-label {
  font-size: 10px;
}
.full-next-title {
  font-size: 14px;
  font-weight: 700;
}
.full-license {
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  border: 1px solid var(--line);
  border-radius: 22px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
