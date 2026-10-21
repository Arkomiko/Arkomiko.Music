<script setup lang="ts">
// Кнопка «Слушать» (крупная пилюля) или круглая розовая «Играть». Во время игры — «Пауза».
import { computed } from 'vue';
import { useStore } from '@nanostores/vue';
import Icon from '../ui/Icon.vue';
import { $current, $playing, playQueue, type PlayerTrack } from '../../stores/player';

const props = withDefaults(
  defineProps<{
    tracks: PlayerTrack[];
    start?: number;
    variant?: 'big' | 'round';
    /** Подписи текущего языка: strings(lang, clientKeys.playButton). */
    t: Record<'player.play' | 'player.pause' | 'release.listen', string>;
  }>(),
  { start: 0, variant: 'big' },
);

const current = useStore($current);
const playing = useStore($playing);

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

<style scoped src="./PlayButton.css"></style>
