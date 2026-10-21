<script setup lang="ts">
// Один плеер на весь сайт. Живёт в Base.astro с transition:persist, поэтому не прерывается при переходах.
// Десктоп — панель 96 px внизу; мобильный — плавающая карточка, по нажатию — полноэкранный плеер.
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useStore } from '@nanostores/vue';
import Icon from '../ui/Icon.vue';
import Spectrum from './Spectrum.vue';
import { connectSpectrum } from '../../lib/spectrum';
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
} from '../../stores/player';
import { defaultLang, localize } from '../../lib/locale';
import { centerOf, toggleTheme } from '../../lib/theme';
import type { clientKeys } from '../../lib/lang';

type Labels = Record<(typeof clientKeys.player)[number], string>;
/** t — подписи языка первой открытой страницы; дальше плеер берёт их из <script id="player-strings"> каждой страницы. */
const props = defineProps<{ library: PlayerTrack[]; t: Labels }>();

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

// Плеер не перерисовывается при переходах, поэтому язык и подписи берём со страницы сами:
// язык — из <html lang>, подписи — из JSON в <script id="player-strings">, который есть на каждой странице.
const lang = ref(defaultLang);
const t = ref<Labels>(props.t);
const syncLang = () => {
  lang.value = document.documentElement.lang || defaultLang;
  const json = document.getElementById('player-strings')?.textContent;
  if (json) t.value = JSON.parse(json);
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

// Кнопка темы в полноэкранном плеере: плавное переключение из её центра (lib/theme.ts).
function onThemeClick(e: MouseEvent) {
  toggleTheme(centerOf(e.currentTarget as Element));
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
          @click="onThemeClick"
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

<style scoped src="./Player.css"></style>
<style scoped src="./Player.rtl.css"></style>
