<script setup lang="ts">
// Треклист на странице релиза: номер, название, BPM, время. Нажатие на строку — играть/пауза.
import { ref, onMounted } from 'vue';
import { useStore } from '@nanostores/vue';
import { $current, $playing, playQueue, type PlayerTrack } from '../../stores/player';

/** t — подписи текущего языка: strings(lang, clientKeys.tracklist). */
defineProps<{ tracks: PlayerTrack[]; t: Record<'player.listen' | 'player.pause', string> }>();
const current = useStore($current);
const playing = useStore($playing);

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

<style scoped src="./Tracklist.css"></style>
