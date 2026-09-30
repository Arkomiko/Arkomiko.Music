<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import { $current, $playing, playQueue, type PlayerTrack } from '../stores/player';

const props = withDefaults(
  defineProps<{
    tracks: PlayerTrack[];
    start?: number;
    label?: string;
    variant?: 'big' | 'row';
  }>(),
  { start: 0, label: 'Слушать', variant: 'big' },
);

const current = useStore($current);
const playing = useStore($playing);

const isThis = computed(() => current.value?.src === props.tracks[props.start]?.src);
const isPlaying = computed(() => isThis.value && playing.value);
</script>

<template>
  <button
    type="button"
    :class="['play', variant, { active: isThis }]"
    :aria-pressed="isPlaying"
    :aria-label="variant === 'row' ? (isPlaying ? 'Пауза' : 'Слушать') : undefined"
    :disabled="!tracks.length"
    @click="playQueue(tracks, start)"
  >
    <svg v-if="isPlaying" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
    <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15L20 12z" /></svg>
    <span v-if="variant === 'big'">{{ isPlaying ? 'Пауза' : label }}</span>
  </button>
</template>

<style scoped>
.play {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  border: 0;
  cursor: pointer;
  font: inherit;
}
.play svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
  flex: none;
}
.play:disabled {
  opacity: 0.4;
  cursor: default;
}
.big {
  padding: 0.85rem 1.5rem 0.85rem 1.2rem;
  border-radius: 999px;
  background: var(--accent);
  color: var(--bg);
  font-weight: 700;
}
.big:hover:not(:disabled) {
  background: color-mix(in oklab, var(--accent) 85%, white);
}
.row {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--muted);
}
.row:hover,
.row.active {
  color: var(--accent);
}
</style>
