<script setup lang="ts">
// Треклист на странице релиза: номер, название, BPM, время. Нажатие на строку — играть/пауза.
import { computed, ref, onMounted } from 'vue';
import { useStore } from '@nanostores/vue';
import { $current, $playing, playQueue, type PlayerTrack } from '../stores/player';
import { ui, type Lang } from '../i18n';

const props = defineProps<{ tracks: PlayerTrack[]; lang: Lang }>();
const current = useStore($current);
const playing = useStore($playing);
const t = computed(() => ui[props.lang]);

const fmt = (s: number) =>
  s ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}` : '0:00';
// Подсветка — только после монтирования, чтобы серверная разметка совпала с первой отрисовкой в браузере.
const mounted = ref(false);
onMounted(() => (mounted.value = true));
const isActive = (tr: PlayerTrack) => mounted.value && current.value?.src === tr.src;
</script>

<template>
  <ol class="list">
    <li v-for="(tr, i) in tracks" :key="tr.src">
      <button
        type="button"
        class="row"
        :class="{ active: isActive(tr) }"
        :aria-label="`${isActive(tr) && playing ? t['player.pause'] : t['player.listen']}: ${tr.title}`"
        @click="playQueue(tracks, i)"
      >
        <span class="n">{{ String(i + 1).padStart(2, '0') }}</span>
        <span class="title">{{ tr.title }}</span>
        <span class="bpm">{{ tr.bpm ?? '—' }}</span>
        <span class="time">{{ fmt(tr.duration) }}</span>
      </button>
    </li>
  </ol>
</template>

<style scoped>
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line);
}
.row {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) 80px 64px;
  gap: 20px;
  align-items: center;
  width: 100%;
  height: 68px;
  padding: 0 16px;
  border: 0;
  border-bottom: 1px solid var(--line);
  background: transparent;
  color: var(--text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.row:hover .title {
  opacity: 0.72;
}
.row.active {
  background: var(--row-active);
}
.n,
.bpm,
.time {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
}
.time {
  text-align: right;
}
.title {
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.active .n,
.active .title {
  color: var(--accent-ink);
}
@media (max-width: 767px) {
  .row {
    grid-template-columns: 25px minmax(0, 1fr) 39px;
    gap: 9px;
    height: 49px;
    padding: 0;
  }
  .bpm {
    display: none;
  }
  .n,
  .time {
    font-size: 11px;
  }
  .title {
    font-size: 13px;
  }
}
</style>
