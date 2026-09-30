// Главные настройки сайта. Всё, что про тебя, а не про конкретный релиз, — здесь.

export type License = { name: string; url?: string };

export const site = {
  name: 'Arkomiko',
  url: 'https://arkomiko.music',
  description: 'Музыка Arkomiko: релизы, техно-демки и обложки.',

  // Лицензии по умолчанию. Поле `license` в release.md перекрывает их.
  licenses: {
    releases: { name: '© Arkomiko. Все права защищены' } as License,
    demos: {
      name: 'CC BY-NC 4.0: можно использовать с указанием автора, не в коммерческих целях',
      url: 'https://creativecommons.org/licenses/by-nc/4.0/deed.ru',
    } as License,
  },

  // Цвет по умолчанию, если у релиза нет обложки или цвета.
  accent: '#9cc3ff',

  socials: [
    { label: 'YouTube', url: 'https://www.youtube.com/' },
    { label: 'Telegram', url: 'https://t.me/' },
    { label: 'Twitch', url: 'https://www.twitch.tv/' },
    { label: 'Discord', url: 'https://discord.gg/' },
    { label: 'GitHub', url: 'https://github.com/' },
  ],
};

// Подписи для ссылок на площадки в release.md → links.
export const platformLabels: Record<string, string> = {
  spotify: 'Spotify',
  apple: 'Apple Music',
  yandex: 'Яндекс Музыка',
  vk: 'VK Музыка',
  youtube: 'YouTube',
  youtubeMusic: 'YouTube Music',
  soundcloud: 'SoundCloud',
  bandcamp: 'Bandcamp',
  deezer: 'Deezer',
};

export const typeLabels: Record<string, string> = {
  single: 'Сингл',
  ep: 'EP',
  album: 'Альбом',
  demo: 'Демо',
};
