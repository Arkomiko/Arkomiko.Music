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
export type Social = { label: string; labelRu?: string; url: string };

export const site = {
  name: 'Arkomiko',
  url: 'https://arkomiko.music',
  email: 'Arikomika@gmail.com', // пусто — на сайте будет заглушка [email]

  // Соцсети: подвал и страница «Об авторе», в этом порядке. Без адреса — на сайте не показывается.
  // labelRu — подпись на русской версии, если отличается.
  socials: [
    { label: 'YouTube', url: 'https://www.youtube.com/@arkomiko_music' },
    { label: 'Telegram', url: 'https://t.me/arkomiko_gr' },
    { label: 'SoundCloud', url: 'https://soundcloud.com/arkomiko' },
    { label: 'Spotify', url: 'https://open.spotify.com/artist/1w1dJBEE10sU9oUVpZCuFp' },
    { label: 'Apple Music', url: 'https://music.apple.com/artist/arkomiko/1626844426' },
    { label: 'Yandex Music', labelRu: 'Яндекс Музыка', url: 'https://music.yandex.ru/artist/16784654' },
    { label: 'Reddit', url: 'https://www.reddit.com/user/Arkomiko/' },
    { label: 'X', url: 'https://x.com/arkomiko21299' },
    { label: 'VK', url: 'https://vk.com/arkomiko_news' },
    { label: 'Twitch', url: 'https://www.twitch.tv/arkomiko' },
    { label: 'Boosty', url: 'https://boosty.to/arkomiko' },
    { label: 'Ko-fi', url: 'https://ko-fi.com/arkomiko' },
  ] as Social[],

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
