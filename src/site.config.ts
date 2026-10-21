// Главные настройки сайта. Всё, что про тебя, а не про конкретный релиз, — здесь.

export type Permission = 'allowed' | 'conditions' | 'forbidden';
export type ReleaseLicense = {
  name: string; // название лицензии на странице релиза
  url?: string; // полный текст: свой адрес (/licenses#…) или внешний
  streams: Permission;
  monetization: Permission;
  remixes: Permission;
  credit?: string; // без значения: «Music: Arkomiko — Название трека»
};

export const site = {
  name: 'Arkomiko',
  url: 'https://arkomiko.music',
  email: 'Arikomika@gmail.com', // пусто — на сайте будет заглушка [email]

  // Соцсети: подвал и страница «Об авторе».
  socials: [
    { label: 'YouTube', url: 'https://www.youtube.com/@arkomiko_music' },
    { label: 'Telegram', url: 'https://t.me/arkomiko_gr' },
    { label: 'SoundCloud', url: 'https://soundcloud.com/arkomiko' },
    { label: 'Discord', url: 'https://discord.gg/mAFDRGj9vH' },
  ],

  // Почта для лицензий, договоров и претензий Content ID.
  licenseEmail: 'Arkomiko.Music@gmail.com',

  // Лицензии по умолчанию для блока «Лицензия» на странице релиза (полные тексты — contents_user/licenses/).
  // Поле `license` в release.md перекрывает, например для релиза через лейбл.
  licenses: {
    // traks/RLS — релизы вне лейблов
    music: {
      name: 'Arkomiko Music License',
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
