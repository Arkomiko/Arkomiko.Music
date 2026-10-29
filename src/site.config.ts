// Настройки сайта. Всё личное — имя, домен, почта, соцсети, состав «Биографии» — лежит в
// contents_user/profile/site.json (в git не попадает; образец — contents_user/profile/.template-content/site.json).
// Здесь — значения шаблона на случай, если профиля нет.

export type Permission = 'allowed' | 'conditions' | 'forbidden';
export type ReleaseLicense = {
  name: string; // название лицензии на странице релиза
  url?: string; // полный текст: свой адрес (/licenses#…) или внешний
  streams: Permission;
  monetization: Permission;
  remixes: Permission;
  credit?: string; // без значения: «Music: <имя> — Название трека»
};
export type Social = { label: string; labelRu?: string; url: string };
/** Пункт ленты «Опыт»: год или «Скоро» (soon); href — заголовок пункта станет ссылкой. */
export type TimelineItem = { year?: string; soon?: boolean; href?: string };
/** Карточки «Чем занимаюсь»: тексты — ключи about.<id>, about.<id>Text, about.<id>Short. */
export type CardId = 'music' | 'voice' | 'animation' | 'video' | 'games' | 'translation' | 'code' | 'label';

type Profile = {
  name: string;
  url: string;
  email: string;
  licenseEmail: string;
  socials: Social[];
  about: { cards: CardId[]; timeline: TimelineItem[] };
};

const defaults: Profile = {
  name: 'Artist',
  url: 'https://example.com',
  email: '', // пусто — на сайте будет заглушка [email]
  licenseEmail: '',
  socials: [],
  about: {
    cards: ['music', 'video', 'code', 'label'],
    timeline: [{ year: '2020' }, { year: '2022' }, { year: '2024' }, { soon: true }],
  },
};

const profileFile = import.meta.glob<Partial<Profile>>('/contents_user/profile/site.json', {
  eager: true,
  import: 'default',
});
const profile: Partial<Profile> = Object.values(profileFile)[0] ?? {};

export const site = {
  ...defaults,
  ...profile,
  about: { ...defaults.about, ...profile.about },
  /** Домен без протокола: arkomiko.net */
  domain: new URL(profile.url ?? defaults.url).host,

  // Лицензии по умолчанию для блока «Лицензия» на странице релиза (полные тексты — contents_user/licenses/).
  // Поле `license` в release.md перекрывает, например для релиза через лейбл.
  licenses: {
    // traks/RLS — релизы вне лейблов
    music: {
      name: `${profile.name ?? defaults.name} Music License`,
      url: '/licenses#music',
      streams: 'allowed',
      monetization: 'allowed',
      remixes: 'conditions', // по согласованию
    } as ReleaseLicense,
    // traks/DR — техно-демки и черновики
    demo: {
      name: 'CC BY-NC-SA 4.0',
      url: '/licenses#demo',
      streams: 'allowed',
      monetization: 'forbidden',
      remixes: 'allowed', // некоммерчески и по той же лицензии
    } as ReleaseLicense,
  },
};

// Соцсети для страницы: только с адресом, подпись — на языке страницы.
export const socialsFor = (lang: string) =>
  site.socials
    .filter((s) => s.url)
    .map((s) => ({ url: s.url, label: (lang === 'ru' && s.labelRu) || s.label }));

// Подписи площадок для release.md → links.
export const platformLabels: Record<string, { ru: string; en: string }> = {
  spotify: { ru: 'Spotify', en: 'Spotify' },
  apple: { ru: 'Apple Music', en: 'Apple Music' },
  yandex: { ru: 'Яндекс Музыка', en: 'Yandex Music' },
  vk: { ru: 'VK Музыка', en: 'VK Music' },
  youtube: { ru: 'YouTube', en: 'YouTube' },
  youtubeMusic: { ru: 'YouTube Music', en: 'YouTube Music' },
  soundcloud: { ru: 'SoundCloud', en: 'SoundCloud' },
  bandcamp: { ru: 'Bandcamp', en: 'Bandcamp' },
  deezer: { ru: 'Deezer', en: 'Deezer' },
  zvuk: { ru: 'Звук', en: 'Zvuk' },
  mts: { ru: 'МТС Музыка', en: 'MTS Music' },
  audset: { ru: 'Аудсет', en: 'Audset' },
};
