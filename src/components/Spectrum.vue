<script setup lang="ts">
// Мини-окно спектрометра: 84 полосы (логарифмически, 30 Гц – 16 кГц) в закруглённой рамке.
// Столбики растут от нижней кромки рамки; пока трек на паузе — плавно опадают.
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { getAnalyser } from '../lib/spectrum';

const props = withDefaults(defineProps<{ playing: boolean; bands?: number }>(), { bands: 84 });

const MIN_HZ = 30;
const MAX_HZ = 16000;

const canvas = ref<HTMLCanvasElement | null>(null);
let levels = new Float32Array(props.bands);
let data: Uint8Array<ArrayBuffer> | null = null;
let raf = 0;
let colors = { bar: '#ffc7ec', idle: '#2a2530' };
let resize: ResizeObserver | null = null;
const reduceMotion =
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function readColors() {
  if (!canvas.value) return;
  const css = getComputedStyle(canvas.value);
  colors = {
    bar: css.getPropertyValue('--accent-ink').trim() || colors.bar,
    idle: css.getPropertyValue('--line-2').trim() || colors.idle,
  };
}

function fit() {
  const c = canvas.value;
  if (!c) return;
  const dpr = window.devicePixelRatio || 1;
  c.width = Math.round(c.clientWidth * dpr);
  c.height = Math.round(c.clientHeight * dpr);
  draw();
  if (props.playing) start();
}

// Полоса i охватывает частоты [f(i), f(i+1)), f — логарифмическая шкала от MIN_HZ до MAX_HZ.
function sample(analyser: AnalyserNode) {
  if (!data || data.length !== analyser.frequencyBinCount) data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  const hzPerBin = analyser.context.sampleRate / 2 / data.length;
  const ratio = MAX_HZ / MIN_HZ;
  const n = props.bands;
  for (let i = 0; i < n; i++) {
    const from = (MIN_HZ * Math.pow(ratio, i / n)) / hzPerBin;
    const to = (MIN_HZ * Math.pow(ratio, (i + 1) / n)) / hzPerBin;
    let v: number;
    if (to - from < 1) {
      // Уже одного отсчёта — берём значение между соседними отсчётами.
      const b = Math.min(data.length - 2, Math.floor(from));
      const k = from - b;
      v = data[b] * (1 - k) + data[b + 1] * k;
    } else {
      v = 0;
      for (let b = Math.floor(from); b < Math.ceil(to) && b < data.length; b++) v = Math.max(v, data[b]);
    }
    const level = Math.pow(v / 255, 1.6);
    levels[i] = Math.max(level, levels[i] * 0.88); // плавное падение пиков
  }
}

function draw() {
  const c = canvas.value;
  const g = c?.getContext('2d');
  if (!c || !g) return;
  const { width: w, height: h } = c;
  const n = props.bands;
  const dpr = window.devicePixelRatio || 1;
  const minH = Math.max(1, Math.round(dpr));
  const perBand = w / n;
  const gap = perBand >= 2 ? Math.max(1, Math.round(perBand * 0.22)) : 0;
  const radius = Math.min(1.5 * dpr, (perBand - gap) / 2);
  const lit = new Path2D();
  const idle = new Path2D();
  for (let i = 0; i < n; i++) {
    const x0 = Math.round(i * perBand);
    const x1 = Math.round((i + 1) * perBand) - gap;
    if (x1 <= x0) continue;
    const bh = Math.max(minH, Math.round(levels[i] * h));
    // Скругляем только верх: низ столбика стоит ровно на нижней кромке рамки.
    (levels[i] > 0.02 ? lit : idle).roundRect(
      x0,
      h - bh,
      x1 - x0,
      bh,
      bh > radius * 2 ? [radius, radius, 0, 0] : 0,
    );
  }
  g.clearRect(0, 0, w, h);
  g.fillStyle = colors.idle;
  g.fill(idle);
  g.fillStyle = colors.bar;
  g.fill(lit);
}

function frame() {
  // Окно скрыто (например, десктоп-панель на телефоне) — не тратим кадры; запустится снова из fit().
  if (!canvas.value?.clientWidth) {
    raf = 0;
    return;
  }
  const analyser = getAnalyser();
  if (props.playing && analyser) sample(analyser);
  else for (let i = 0; i < levels.length; i++) levels[i] *= 0.88;
  draw();
  const settled = levels.every((v) => v < 0.005);
  raf = props.playing || !settled ? requestAnimationFrame(frame) : 0;
}

function start() {
  if (reduceMotion || raf) return;
  raf = requestAnimationFrame(frame);
}

watch(
  () => props.playing,
  (p) => {
    if (p) start();
  },
);

function onTheme() {
  // CSS-переменные меняются после смены data-theme — читаем в следующем кадре.
  requestAnimationFrame(() => {
    readColors();
    draw();
  });
}

onMounted(() => {
  levels = new Float32Array(props.bands);
  readColors();
  resize = new ResizeObserver(fit);
  if (canvas.value) resize.observe(canvas.value);
  fit();
  document.addEventListener('themechange', onTheme);
  if (props.playing) start();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  raf = 0;
  resize?.disconnect();
  document.removeEventListener('themechange', onTheme);
});
</script>

<template>
  <div class="spectrum-frame">
    <canvas ref="canvas" class="spectrum" aria-hidden="true" />
  </div>
</template>

<style scoped>
/* Закруглённая рамка вокруг спектра */
.spectrum-frame {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 6px 12px 0; /* снизу без отступа: столбики стоят на кромке рамки */
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--bg);
}
.spectrum {
  display: block;
  flex: 1;
  min-width: 0;
  height: 100%;
}
</style>
