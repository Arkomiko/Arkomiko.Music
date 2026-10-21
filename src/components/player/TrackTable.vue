<script setup lang="ts">
// Таблица треков (десктоп) или список (мобильный) с кнопками «Скачать» и «Играть».
// На главной — первые `limit` строк и ссылка «Смотреть всё» на /tracks; на /tracks — все треки и фильтр по статусу.
import { computed, ref, onMounted } from 'vue';
import { useStore } from '@nanostores/vue';
import Icon from '../ui/Icon.vue';
import { $current, $playing, playQueue, type PlayerTrack } from '../../stores/player';
import { localize } from '../../lib/locale';
import type { clientKeys } from '../../lib/lang';

type Status = PlayerTrack['status'];

const props = defineProps<{
  tracks: PlayerTrack[];
  lang: string;
  /** Подписи текущего языка: strings(lang, clientKeys.trackTable). */
  t: Record<(typeof clientKeys.trackTable)[number], string>;
  /** Заголовок над таблицей (на /tracks заголовок страницы свой). */
  title?: string;
  /** Сколько строк показывать; без значения — все. */
  limit?: number;
  /** Куда ведёт «Смотреть всё». */
  seeAllHref?: string;
  /** Фильтр по статусу: Все / Релизные / Пред-релизные / Черновики. */
  filters?: boolean;
}>();

const current = useStore($current);
const playing = useStore($playing);
const filter = ref<'all' | Status>('all');
const statuses: Status[] = ['released', 'prerelease', 'draft'];
const filterLabel: Record<
  'all' | Status,
  'filter.all' | 'filter.released' | 'filter.prerelease' | 'filter.drafts'
> = {
  all: 'filter.all',
  released: 'filter.released',
  prerelease: 'filter.prerelease',
  draft: 'filter.drafts',
};
// Очередь плеера — все треки под текущим фильтром, а не только видимые строки.
const queue = computed(() =>
  filter.value === 'all' ? props.tracks : props.tracks.filter((tr) => tr.status === filter.value),
);
const visible = computed(() => (props.limit ? queue.value.slice(0, props.limit) : queue.value));
const hasMore = computed(() => !!props.seeAllHref);

const badge = { released: 'badge-fill', prerelease: 'badge-ink', draft: 'badge-muted' } as const;

function fmt(s: number) {
  if (!s) return '0:00';
  return `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
}
// Подсветка — только после монтирования, чтобы серверная разметка совпала с первой отрисовкой в браузере.
const mounted = ref(false);
onMounted(() => (mounted.value = true));
const isActive = (tr: PlayerTrack) => mounted.value && current.value?.src === tr.src;
const isPlaying = (tr: PlayerTrack) => isActive(tr) && playing.value;
</script>

<template>
  <div class="tracks">
    <div v-if="title || filters" class="head">
      <h2 v-if="title" class="h2">{{ title }}</h2>
      <a v-if="hasMore" class="see-all" :href="seeAllHref">{{ t['home.seeAll'] }}</a>
      <div v-if="filters" class="chips" role="group" :aria-label="t['filter.status']">
        <button
          v-for="f in ['all', ...statuses] as const"
          :key="f"
          type="button"
          class="chip"
          :aria-pressed="filter === f"
          @click="filter = f"
        >
          {{ t[filterLabel[f] as keyof typeof t] }}
        </button>
      </div>
    </div>

    <p v-if="!visible.length" class="muted">{{ t['home.empty'] }}</p>
    <template v-else>
      <div class="row cols" aria-hidden="true">
        <span>{{ t['col.id'] }}</span
        ><span>{{ t['col.cover'] }}</span
        ><span>{{ t['col.title'] }}</span
        ><span>{{ t['col.time'] }}</span
        ><span>{{ t['col.genre'] }}</span
        ><span>{{ t['col.type'] }}</span
        ><span />
      </div>
      <ul class="list">
        <li v-for="tr in visible" :key="tr.src" class="row" :class="{ active: isActive(tr) }">
          <span class="id">{{ tr.id }}</span>
          <a class="cover" :href="localize(tr.href, lang)" tabindex="-1" aria-hidden="true">
            <img v-if="tr.cover" :src="tr.cover" alt="" width="48" height="48" loading="lazy" />
            <span v-else class="cover-empty" />
          </a>
          <span class="name">
            <a class="title" :href="localize(tr.href, lang)">{{ tr.title }}</a>
            <span class="artist">{{ tr.artist }}</span>
            <span class="m-meta">
              <span class="badge" :class="badge[tr.status]">{{ t[`status.${tr.status}`] }}</span>
              <span class="m-info">{{ tr.id }} · {{ tr.genre ?? '—' }} · {{ fmt(tr.duration) }}</span>
            </span>
          </span>
          <span class="time">{{ fmt(tr.duration) }}</span>
          <span class="genre">{{ tr.genre ?? '—' }}</span>
          <span class="type"
            ><span class="badge" :class="badge[tr.status]">{{ t[`status.${tr.status}`] }}</span></span
          >
          <span class="actions">
            <a
              v-if="tr.download"
              class="dl"
              :href="tr.src"
              :download="tr.file"
              :aria-label="`${t['player.download']}: ${tr.title}`"
            >
              <Icon name="download" :size="16" />
            </a>
            <span v-else class="dl is-off" aria-hidden="true"><Icon name="download" :size="16" /></span>
            <button
              type="button"
              class="play"
              :aria-label="`${isPlaying(tr) ? t['player.pause'] : t['player.listen']}: ${tr.title}`"
              @click="playQueue(queue, queue.indexOf(tr))"
            >
              <Icon :name="isPlaying(tr) ? 'pause' : 'play'" :size="16" />
            </button>
          </span>
        </li>
      </ul>
      <a v-if="hasMore" class="btn btn-outline m-see-all" :href="seeAllHref">{{ t['home.seeAll'] }}</a>
    </template>
  </div>
</template>

<style scoped src="./TrackTable.css"></style>
