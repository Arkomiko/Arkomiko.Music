<script setup lang="ts">
// Кнопка «Слушать» (крупная пилюля) или круглая розовая «Играть». Во время игры — «Пауза».
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import Icon from './Icon.vue';
import { $current, $playing, playQueue, type PlayerTrack } from '../stores/player';
import { ui, defaultLang, type Lang } from '../i18n';

const props = withDefaults(
  defineProps<{
    tracks: PlayerTrack[];
    start?: number;
    variant?: 'big' | 'round';
    lang?: Lang;
  }>(),
  { start: 0, variant: 'big', lang: defaultLang },
);

const current = useStore($current);
const playing = useStore($playing);
const t = computed(() => ui[props.lang]);

const isThis = computed(() => current.value?.src === props.tracks[props.start]?.src);
const isPlaying = computed(() => isThis.value && playing.value);
</script>

<template>
  <button
    v-if="variant === 'big'"
    type="button"
    class="btn btn-primary"
    :disabled="!tracks.length"
    @click="playQueue(tracks, start)"
  >
    <Icon :name="isPlaying ? 'pause' : 'playWide'" />
    {{ isPlaying ? t['player.pause'] : t['release.listen'] }}
  </button>
  <button
    v-else
    type="button"
    class="round"
    :aria-label="isPlaying ? t['player.pause'] : t['player.play']"
    :aria-pressed="isPlaying"
    :disabled="!tracks.length"
    @click="playQueue(tracks, start)"
  >
    <Icon :name="isPlaying ? 'pause' : 'play'" :size="16" />
  </button>
</template>

<style scoped>
.btn:disabled {
  opacity: 0.4;
  cursor: default;
}
.round {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 20px;
  background: var(--accent);
  color: var(--on-accent);
  cursor: pointer;
}
.round:disabled {
  opacity: 0.4;
}
</style>
