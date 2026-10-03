// Главные настройки сайта. Всё, что про тебя, а не про конкретный релиз, — здесь.

export type Permission = 'allowed' | 'conditions' | 'forbidden';
export type ReleaseLicense = {
  streams: Permission;
  monetization: Permission;
  remixes: Permission;
  credit: string;
};

export const site = {
  name: 'Arkomiko',
  url: 'https://arkomiko.music',
  email: '', // пусто — на сайте будет заглушка [email]

  // Соцсети: подвал и страница «Об авторе».
  socials: [
    { label: 'YouTube', url: 'https://www.youtube.com/' },
    { label: 'Telegram', url: 'https://t.me/' },
    { label: 'SoundCloud', url: 'https://soundcloud.com/' },
    { label: 'Discord', url: 'https://discord.gg/' },
  ],

  // Лицензия по умолчанию для блока «Лицензия» на странице релиза. Поле `license` в release.md перекрывает.
  license: {
    streams: 'allowed',
    monetization: 'conditions',
    remixes: 'conditions',
    credit: 'Music: Arkomiko',
  } as ReleaseLicense,
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
};
