<script setup lang="ts">
// Таблица треков (десктоп) или список (мобильный) с кнопками «Скачать» и «Играть».
// На главной — первые `limit` строк и ссылка «Смотреть всё» на /tracks; на /tracks — все треки и фильтр по статусу.
import { computed, ref, onMounted } from 'vue';
import { useStore } from '@nanostores/vue';
import Icon from './Icon.vue';
import { $current, $playing, playQueue, type PlayerTrack } from '../stores/player';
import { ui, localize, type Lang } from '../i18n';

type Status = PlayerTrack['status'];

const props = defineProps<{
  tracks: PlayerTrack[];
  lang: Lang;
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
const t = computed(() => ui[props.lang]);
const filter = ref<'all' | Status>('all');
const statuses: Status[] = ['released', 'prerelease', 'draft'];
const filterLabel: Record<'all' | Status, string> = {
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

<style scoped>
.tracks {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
}
.see-all {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.row {
  display: grid;
  grid-template-columns: 64px 56px minmax(0, 1fr) 80px 140px 160px 96px;
  gap: 20px;
  align-items: center;
  padding: 0 16px;
}
.cols {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--muted);
  text-transform: uppercase;
}
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--line);
}
.list .row {
  height: 76px;
  border-bottom: 1px solid var(--line);
}
.list .row.active {
  background: var(--row-active);
}
.id,
.time {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
}
.active .id,
.active .title {
  color: var(--accent-ink);
}
.cover img,
.cover-empty {
  display: block;
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 3px;
  background: var(--surface-2);
}
.name {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.title {
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.artist,
.genre {
  font-size: 13px;
  color: var(--muted);
}
.m-meta,
.m-see-all {
  display: none;
}
.actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dl,
.play {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 20px;
  cursor: pointer;
}
.dl {
  border: 1px solid var(--line-2);
  color: var(--text);
}
.dl.is-off {
  opacity: 0.3;
  cursor: default;
}
.play {
  border: 0;
  background: var(--accent);
  color: var(--on-accent);
}

@media (max-width: 1199px) {
  .row {
    grid-template-columns: 48px 48px minmax(0, 1fr) 56px 110px 140px 86px;
    gap: 14px;
    padding: 0 10px;
  }
}
@media (max-width: 959px) {
  .row {
    grid-template-columns: 48px 48px minmax(0, 1fr) 56px 140px 86px;
  }
  .genre,
  .cols span:nth-child(5) {
    display: none;
  }
}
@media (max-width: 767px) {
  .tracks {
    gap: 12px;
  }
  .see-all,
  .cols,
  .id,
  .time,
  .genre,
  .type,
  .artist {
    display: none;
  }
  .list .row {
    grid-template-columns: 42px minmax(0, 1fr) auto;
    gap: 9px;
    height: auto;
    padding: 10px 0;
  }
  .cover img,
  .cover-empty {
    width: 42px;
    height: 42px;
    border-radius: 2.6px;
  }
  .name {
    gap: 4px;
  }
  .title {
    font-size: 13px;
  }
  .m-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
  }
  .m-meta .badge {
    height: 18px;
    padding: 0 7px;
    font-size: 10px;
  }
  .m-info {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--muted);
  }
  .actions {
    gap: 9px;
  }
  .dl,
  .play {
    border-radius: 18px;
  }
  .m-see-all {
    display: inline-flex;
    width: 100%;
    margin-top: 4px;
  }
}
</style>
