// Языки сайта. Русский — основной, живёт в корне (/about), английский — под /en (/en/about).
// Чтобы добавить язык: код в `langs`, словарь в `ui`, страницы в src/pages/<код>/.
// Тексты в [квадратных скобках] — заглушки из макета, замени их своими.

export const langs = ['ru', 'en'] as const;
export type Lang = (typeof langs)[number];
export const defaultLang: Lang = 'ru';

export const langNames: Record<Lang, string> = { ru: 'Русский', en: 'English' };

const ru = {
  'site.description': 'Музыка Arkomiko: релизы, техно-демки, каверы и сэмпл-паки — с плеером и лицензиями.',

  'nav.homePage': 'Главная',
  'nav.music': 'Музыка',
  'nav.materials': 'Материалы',
  'nav.bio': 'Биография',
  'nav.licenses': 'Лицензии',
  'nav.contacts': 'Контакты',
  'nav.main': 'Основное меню',
  'nav.home': 'Arkomiko — на главную',
  'lang.label': 'Язык сайта',
  'lang.current': 'Язык сайта: Русский',
  'theme.toLight': 'Включить светлую тему',
  'theme.toDark': 'Включить тёмную тему',
  'menu.open': 'Открыть меню',
  'menu.close': 'Закрыть меню',
  'search.label': 'Поиск',
  'search.placeholder': 'Название, жанр или тег',
  'search.empty': 'Ничего не нашлось',
  'logo.alt': 'Логотип Arkomiko',

  'home.eyebrow': 'Об авторе',
  'home.lead': 'Музыкант и автор контента. [Пара предложений о себе и своей музыке.]',
  'home.text':
    'Этот сайт — плеер и каталог всей моей музыки: релизы, техно-демки, каверы и сэмпл-паки. У каждого релиза указано, как его можно использовать — в стримах, видео и своих проектах.',
  'home.textShort':
    'Этот сайт — плеер и каталог всей моей музыки: релизы, техно-демки, каверы и сэмпл-паки. У каждого релиза указано, как его можно использовать.',
  'home.more': 'Подробнее...',
  'home.library': 'К библиотеке',
  'home.latest': 'Последние релизы',
  'home.allReleases': 'Все релизы',
  'home.tracks': 'Треки',
  'home.seeAll': 'Смотреть всё',
  'home.empty': 'Здесь пока пусто.',

  'filter.label': 'Тип релиза',
  'filter.all': 'Все',
  'filter.singles': 'Синглы',
  'filter.albums': 'Альбомы',
  'filter.covers': 'Каверы',
  'filter.samples': 'Материалы',
  'filter.status': 'Статус трека',
  'filter.released': 'Релизные',
  'filter.prerelease': 'Пред-релизные',
  'filter.drafts': 'Черновики',

  'tracks.eyebrow': 'Музыка',
  'tracks.title': 'Все треки',
  'tracks.lead': 'Вся музыка Arkomiko в одном списке: релизы, пред-релизные версии и черновики.',
  'tracks.text':
    'Нажмите «Играть», чтобы слушать подряд, — плеер не остановится при переходе на другие страницы. Условия использования —',
  'tracks.count': 'Треков: {n}',

  'col.id': 'ID',
  'col.cover': 'Обложка',
  'col.title': 'Название',
  'col.time': 'Время',
  'col.genre': 'Жанр',
  'col.type': 'Тип',

  'kind.single': 'Сингл',
  'kind.album': 'Альбом',
  'kind.ep': 'EP',
  'kind.cover': 'Кавер',
  'kind.techno-demo': 'Техно-демо',
  'kind.samples': 'Материалы',

  'status.released': 'Релизная',
  'status.prerelease': 'Пред-релизная',
  'status.draft': 'Черновик',

  'composition.original': 'Оригинал',
  'composition.cover': 'Кавер',
  'composition.remix': 'Ремикс',

  'release.composition': 'Тип композиции',
  'release.genre': 'Жанр',
  'release.bpm': 'BPM',
  'release.key': 'Тональность',
  'release.listen': 'Слушать',
  'release.download': 'Скачать',
  'release.tracklist': 'Треклист',
  'release.tags': 'Теги',
  'release.tagsHint': 'Настроение, где использовать, похожие жанры — по тегам можно найти похожие треки.',
  'release.listenOn': 'Слушать на',
  'release.license': 'Лицензия',
  'release.fullLicense': 'Полный текст лицензии',
  'license.streams': 'Стримы и видео',
  'license.monetization': 'Монетизация',
  'license.remixes': 'Ремиксы',
  'license.credit': 'Указание автора',
  'perm.allowed': 'Можно',
  'perm.conditions': 'Условия',
  'perm.forbidden': 'Нельзя',

  'player.play': 'Играть',
  'player.listen': 'Слушать',
  'player.pause': 'Пауза',
  'player.prev': 'Предыдущий',
  'player.next': 'Следующий',
  'player.seek': 'Позиция в треке',
  'player.volume': 'Громкость',
  'player.download': 'Скачать',
  'player.nowPlaying': 'Сейчас играет',
  'player.collapse': 'Свернуть',
  'player.expand': 'Открыть плеер',
  'player.shuffle': 'Перемешать',
  'player.repeat': 'Повтор',
  'player.upNext': 'Далее',
  'player.license': 'Лицензия',

  'about.lead': 'Музыкант и автор контента. [Пара предложений о себе: откуда, с чего начиналась музыка.]',
  'about.leadShort': 'Музыкант и автор контента. [Пара предложений о себе.]',
  'about.bio':
    '[Биография: как пришли к электронной музыке, что вдохновляет, на чём пишете треки, чем отличается ваш звук. 3–5 предложений.]',
  'about.bioShort': '[Биография: как пришли к электронной музыке, что вдохновляет, чем отличается ваш звук.]',
  'about.doing': 'Чем занимаюсь',
  'about.music': 'Музыка',
  'about.musicText': 'Электронная музыка: релизы, техно-демки, каверы и сэмпл-паки.',
  'about.musicShort': 'Релизы, техно-демки, каверы и сэмпл-паки.',
  'about.content': 'Контент',
  'about.contentText': 'Видео, стримы и туториалы о том, как делается музыка.',
  'about.contentShort': 'Видео, стримы и туториалы.',
  'about.label': 'Лейбл',
  'about.labelText': 'Kitsuriko Studio — площадка для своих и чужих релизов.',
  'about.labelShort': 'Kitsuriko Studio — свои и чужие релизы.',
  'about.games': 'Игры',
  'about.gamesText': 'Sola Creators — инди-игры и саундтреки к ним.',
  'about.gamesShort': 'Sola Creators — инди-игры и саундтреки.',
  'about.experience': 'Опыт',
  'about.experienceText': 'Путь в музыке и вокруг неё. Годы в скобках — заполните своими.',
  'about.exp1': 'Discord-сервер «Уютный бар Arkomiko»',
  'about.exp1Text': 'Своё сообщество — место, где собираются слушатели и друзья.',
  'about.exp2': 'Первый альбом и два сингла',
  'about.exp2Text': 'Релизы на стриминговых площадках. [Названия релизов]',
  'about.exp3': 'YouTube-канал Arkomiko: Music',
  'about.exp3Text': 'Своя музыка, техно-демки и туториалы.',
  'about.exp4': 'Kitsuriko Studio',
  'about.exp4Text': 'Свой лейбл: музыка, клипы и мерч.',
  'about.exp5': 'Sola Creators',
  'about.exp5Text': 'Инди-игры — разработка и музыка к ним.',
  'about.exp6': 'Сайт Arkomiko',
  'about.exp6Text': 'Вся музыка в одном месте — с плеером и лицензиями.',
  'about.year': '[Год]',
  'about.contacts': 'Контакты',
  'about.contactsText': 'Сотрудничество, лицензии, заказы музыки:',

  'samples.eyebrow': 'Материалы',
  'samples.title': 'Материалы',
  'samples.lead':
    '[Короткое описание: сэмплы, пресеты, проекты и коллекции — для продюсеров, битмейкеров, стримеров.]',
  'samples.text':
    '[Описание: из каких треков собраны звуки, в каком формате, как часто выходят новые материалы. Всё можно использовать в своих треках по условиям лицензии.]',
  'samples.all': 'Все материалы',
  'pack.Semples': 'Сэмплы',
  'pack.Presets': 'Пресеты',
  'pack.Projects': 'Проекты',
  'pack.Collection': 'Коллекции',
  'packOne.Semples': 'Сэмпл-пак',
  'packOne.Presets': 'Пресеты',
  'packOne.Projects': 'Проект',
  'packOne.Collection': 'Коллекция',
  'samples.count': '{n} сэмплов',
  'samples.free': 'Бесплатно',
  'samples.preview': 'Прослушать',
  'samples.download': 'Скачать',
  'samples.empty': 'Материалы скоро появятся.',
  'samples.how': 'Как устроены паки',
  'samples.inside': 'Что внутри',
  'samples.insideText':
    '[Состав пака: драмы, лупы, one-shots, MIDI, пресеты. Количество файлов и общий объём.]',
  'samples.format': 'Формат',
  'samples.formatText': '[WAV 24-bit / 44.1 kHz, названия файлов с BPM и тональностью, папки по категориям.]',
  'samples.use': 'Как использовать',
  'samples.useText':
    '[Коротко: можно в своих треках и видео, нельзя перепродавать сами сэмплы. Подробно — на странице «Лицензии».]',
  'samples.terms': 'Условия лицензии',

  'licenses.eyebrow': 'Лицензии',
  'licenses.title': 'Как использовать музыку',
  'licenses.lead':
    '[Короткое объяснение: музыку Arkomiko можно использовать в стримах, видео и своих проектах — условия зависят от типа лицензии.]',
  'licenses.text':
    '[Здесь можно описать общие правила: что разрешено всегда, что требует покупки лицензии, как связаться для особых случаев.]',
  'licenses.types': 'Типы лицензий',
  'licenses.free': 'Бесплатная',
  'licenses.freePrice': '[0 ₽]',
  'licenses.freeText': '[Для стримов, видео и некоммерческих проектов. Обязательно указать автора.]',
  'licenses.standard': 'Стандартная',
  'licenses.standardPrice': '[Цена]',
  'licenses.standardText':
    '[Монетизация, подкасты, использование в своих треках. Указание автора желательно.]',
  'licenses.extended': 'Расширенная',
  'licenses.extendedPrice': '[Цена / по запросу]',
  'licenses.extendedText': '[Реклама, игры, приложения, эксклюзивные права. Условия обсуждаются отдельно.]',
  'licenses.allowed': 'Что можно',
  'licenses.where': 'Где используется',
  'licenses.use.streams': 'Стримы (Twitch, YouTube Live)',
  'licenses.use.videos': 'Видео на YouTube / TikTok',
  'licenses.use.monetization': 'Монетизация видео',
  'licenses.use.podcasts': 'Подкасты',
  'licenses.use.games': 'Игры и приложения',
  'licenses.use.ads': 'Реклама и коммерция',
  'licenses.use.remixes': 'Ремиксы и каверы',
  'licenses.use.samples': 'Сэмплы в своих треках',
  'licenses.yes': 'Можно',
  'licenses.cond': 'С условием',
  'licenses.no': 'Нельзя',
  'licenses.credit': 'Указание автора',
  'licenses.creditText': '[Куда вставить строку: описание видео, титры, страница проекта.]',
  'licenses.creditLine':
    'Music: Arkomiko — [Название трека]\n[Ссылка на трек на сайте]\nLicense: [Тип лицензии]',
  'licenses.copy': 'Скопировать',
  'licenses.copied': 'Скопировано',
  'licenses.faq': 'Вопросы',
  'licenses.q1': 'Что будет, если не указать автора?',
  'licenses.a1': '[Ответ: например, видео может получить претензию Content ID — как её снять.]',
  'licenses.q2': 'Можно ли использовать трек в видео с рекламой?',
  'licenses.a2': '[Ответ по условиям стандартной лицензии.]',
  'licenses.q3': 'Как получить расширенную лицензию?',
  'licenses.a3': '[Ответ: написать на почту, указать проект и способ использования.]',
  'licenses.q4': 'Распространяется ли лицензия на сэмпл-паки?',
  'licenses.a4': '[Ответ: отдельные условия для сэмплов.]',
  'licenses.special': 'Особый случай?',
  'licenses.specialText': 'Напишите, для какого проекта нужна музыка:',
  'licenses.contact': 'Связаться',

  'empty.content.title': 'Похоже, что-то с контентом сайта!',
  'empty.content.note': 'Не переживайте, я вскоре решу проблему.',
  'empty.tracks.title': 'На сайт пока что не загружено ни одного трека!',
  'empty.tracks.note': 'Возможно, тут скоро что-то появится!',
  'empty.packs.title': 'Тут пока что ничего нет!',
  'empty.packs.note': 'Возможно, тут скоро что-то появится!',

  'error.home': 'На главную',
  'error.404.title': 'Такой страницы нет',
  'error.404.text': 'Возможно, релиз переименовали или адрес набран с ошибкой.',
  'error.403.title': 'Доступ закрыт',
  'error.403.text': 'Эта страница недоступна для просмотра.',
  'error.500.title': 'Что-то сломалось',
  'error.500.text': 'На сервере произошла ошибка. Попробуйте обновить страницу чуть позже.',
  'error.503.title': 'Сайт на обслуживании',
  'error.503.text': 'Скоро всё заработает — загляните чуть позже.',
};

export type UiKey = keyof typeof ru;

const en: Record<UiKey, string> = {
  'site.description':
    'Music by Arkomiko: releases, tech demos, covers and sample packs — with a player and licenses.',

  'nav.homePage': 'Home',
  'nav.music': 'Music',
  'nav.materials': 'Materials',
  'nav.bio': 'Biography',
  'nav.licenses': 'Licenses',
  'nav.contacts': 'Contacts',
  'nav.main': 'Main menu',
  'nav.home': 'Arkomiko — home',
  'lang.label': 'Site language',
  'lang.current': 'Site language: English',
  'theme.toLight': 'Switch to light theme',
  'theme.toDark': 'Switch to dark theme',
  'menu.open': 'Open menu',
  'menu.close': 'Close menu',
  'search.label': 'Search',
  'search.placeholder': 'Title, genre or tag',
  'search.empty': 'Nothing found',
  'logo.alt': 'Arkomiko logo',

  'home.eyebrow': 'About',
  'home.lead': 'Musician and content creator. [A couple of sentences about me and my music.]',
  'home.text':
    'This site is a player and a catalog of all my music: releases, tech demos, covers and sample packs. Every release says how you can use it — in streams, videos and your own projects.',
  'home.textShort':
    'This site is a player and a catalog of all my music: releases, tech demos, covers and sample packs. Every release says how you can use it.',
  'home.more': 'More...',
  'home.library': 'To the library',
  'home.latest': 'Latest releases',
  'home.allReleases': 'All releases',
  'home.tracks': 'Tracks',
  'home.seeAll': 'See all',
  'home.empty': 'Nothing here yet.',

  'filter.label': 'Release type',
  'filter.all': 'All',
  'filter.singles': 'Singles',
  'filter.albums': 'Albums',
  'filter.covers': 'Covers',
  'filter.samples': 'Materials',
  'filter.status': 'Track status',
  'filter.released': 'Released',
  'filter.prerelease': 'Pre-release',
  'filter.drafts': 'Drafts',

  'tracks.eyebrow': 'Music',
  'tracks.title': 'All tracks',
  'tracks.lead': 'All of Arkomiko’s music in one list: releases, pre-release versions and drafts.',
  'tracks.text':
    'Press Play to listen in a row — the player keeps going when you open other pages. Terms of use:',
  'tracks.count': 'Tracks: {n}',

  'col.id': 'ID',
  'col.cover': 'Cover',
  'col.title': 'Title',
  'col.time': 'Time',
  'col.genre': 'Genre',
  'col.type': 'Type',

  'kind.single': 'Single',
  'kind.album': 'Album',
  'kind.ep': 'EP',
  'kind.cover': 'Cover',
  'kind.techno-demo': 'Tech demo',
  'kind.samples': 'Materials',

  'status.released': 'Released',
  'status.prerelease': 'Pre-release',
  'status.draft': 'Draft',

  'composition.original': 'Original',
  'composition.cover': 'Cover',
  'composition.remix': 'Remix',

  'release.composition': 'Composition',
  'release.genre': 'Genre',
  'release.bpm': 'BPM',
  'release.key': 'Key',
  'release.listen': 'Listen',
  'release.download': 'Download',
  'release.tracklist': 'Tracklist',
  'release.tags': 'Tags',
  'release.tagsHint': 'Mood, where to use it, similar genres — tags help you find similar tracks.',
  'release.listenOn': 'Listen on',
  'release.license': 'License',
  'release.fullLicense': 'Full license terms',
  'license.streams': 'Streams and videos',
  'license.monetization': 'Monetization',
  'license.remixes': 'Remixes',
  'license.credit': 'Credit',
  'perm.allowed': 'Allowed',
  'perm.conditions': 'Conditions',
  'perm.forbidden': 'Not allowed',

  'player.play': 'Play',
  'player.listen': 'Listen',
  'player.pause': 'Pause',
  'player.prev': 'Previous',
  'player.next': 'Next',
  'player.seek': 'Track position',
  'player.volume': 'Volume',
  'player.download': 'Download',
  'player.nowPlaying': 'Now playing',
  'player.collapse': 'Collapse',
  'player.expand': 'Open player',
  'player.shuffle': 'Shuffle',
  'player.repeat': 'Repeat',
  'player.upNext': 'Up next',
  'player.license': 'License',

  'about.lead':
    'Musician and content creator. [A couple of sentences about where I come from and how the music started.]',
  'about.leadShort': 'Musician and content creator. [A couple of sentences about me.]',
  'about.bio':
    '[Bio: how you came to electronic music, what inspires you, what you make tracks with, what makes your sound different. 3–5 sentences.]',
  'about.bioShort':
    '[Bio: how you came to electronic music, what inspires you, what makes your sound different.]',
  'about.doing': 'What I do',
  'about.music': 'Music',
  'about.musicText': 'Electronic music: releases, tech demos, covers and sample packs.',
  'about.musicShort': 'Releases, tech demos, covers and sample packs.',
  'about.content': 'Content',
  'about.contentText': 'Videos, streams and tutorials on how music gets made.',
  'about.contentShort': 'Videos, streams and tutorials.',
  'about.label': 'Label',
  'about.labelText': 'Kitsuriko Studio — a home for my own and other artists’ releases.',
  'about.labelShort': 'Kitsuriko Studio — own and others’ releases.',
  'about.games': 'Games',
  'about.gamesText': 'Sola Creators — indie games and their soundtracks.',
  'about.gamesShort': 'Sola Creators — indie games and soundtracks.',
  'about.experience': 'Experience',
  'about.experienceText': 'The path in music and around it. Years in brackets — fill in your own.',
  'about.exp1': 'Discord server “Arkomiko’s Cozy Bar”',
  'about.exp1Text': 'My own community — where listeners and friends hang out.',
  'about.exp2': 'First album and two singles',
  'about.exp2Text': 'Releases on streaming platforms. [Release titles]',
  'about.exp3': 'YouTube channel Arkomiko: Music',
  'about.exp3Text': 'My music, tech demos and tutorials.',
  'about.exp4': 'Kitsuriko Studio',
  'about.exp4Text': 'My own label: music, music videos and merch.',
  'about.exp5': 'Sola Creators',
  'about.exp5Text': 'Indie games — development and music for them.',
  'about.exp6': 'Arkomiko website',
  'about.exp6Text': 'All the music in one place — with a player and licenses.',
  'about.year': '[Year]',
  'about.contacts': 'Contacts',
  'about.contactsText': 'Collaborations, licenses, commissions:',

  'samples.eyebrow': 'Materials',
  'samples.title': 'Materials',
  'samples.lead':
    '[Short description: samples, presets, projects and collections — for producers, beatmakers, streamers.]',
  'samples.text':
    '[Description: which tracks the sounds come from, the format, how often new materials come out. Everything can be used in your tracks under the license terms.]',
  'samples.all': 'All materials',
  'pack.Semples': 'Samples',
  'pack.Presets': 'Presets',
  'pack.Projects': 'Projects',
  'pack.Collection': 'Collections',
  'packOne.Semples': 'Sample pack',
  'packOne.Presets': 'Presets',
  'packOne.Projects': 'Project',
  'packOne.Collection': 'Collection',
  'samples.count': '{n} samples',
  'samples.free': 'Free',
  'samples.preview': 'Preview',
  'samples.download': 'Download',
  'samples.empty': 'Materials are coming soon.',
  'samples.how': 'How packs work',
  'samples.inside': 'What’s inside',
  'samples.insideText':
    '[Pack contents: drums, loops, one-shots, MIDI, presets. Number of files and total size.]',
  'samples.format': 'Format',
  'samples.formatText': '[WAV 24-bit / 44.1 kHz, file names with BPM and key, folders by category.]',
  'samples.use': 'How to use',
  'samples.useText':
    '[In short: fine in your tracks and videos, reselling the samples themselves is not allowed. Details on the Licenses page.]',
  'samples.terms': 'License terms',

  'licenses.eyebrow': 'Licenses',
  'licenses.title': 'How to use the music',
  'licenses.lead':
    '[Short explanation: Arkomiko’s music can be used in streams, videos and your own projects — the terms depend on the license type.]',
  'licenses.text':
    '[Describe the general rules here: what is always allowed, what requires a license, how to get in touch for special cases.]',
  'licenses.types': 'License types',
  'licenses.free': 'Free',
  'licenses.freePrice': '[$0]',
  'licenses.freeText': '[For streams, videos and non-commercial projects. Credit is required.]',
  'licenses.standard': 'Standard',
  'licenses.standardPrice': '[Price]',
  'licenses.standardText': '[Monetization, podcasts, use in your own tracks. Credit is appreciated.]',
  'licenses.extended': 'Extended',
  'licenses.extendedPrice': '[Price / on request]',
  'licenses.extendedText': '[Ads, games, apps, exclusive rights. Terms are discussed separately.]',
  'licenses.allowed': 'What’s allowed',
  'licenses.where': 'Where it’s used',
  'licenses.use.streams': 'Streams (Twitch, YouTube Live)',
  'licenses.use.videos': 'YouTube / TikTok videos',
  'licenses.use.monetization': 'Video monetization',
  'licenses.use.podcasts': 'Podcasts',
  'licenses.use.games': 'Games and apps',
  'licenses.use.ads': 'Ads and commercial use',
  'licenses.use.remixes': 'Remixes and covers',
  'licenses.use.samples': 'Samples in your tracks',
  'licenses.yes': 'Allowed',
  'licenses.cond': 'With conditions',
  'licenses.no': 'Not allowed',
  'licenses.credit': 'Credit',
  'licenses.creditText': '[Where to put the line: video description, credits, project page.]',
  'licenses.creditLine':
    'Music: Arkomiko — [Track title]\n[Link to the track on the site]\nLicense: [License type]',
  'licenses.copy': 'Copy',
  'licenses.copied': 'Copied',
  'licenses.faq': 'Questions',
  'licenses.q1': 'What happens if I don’t credit the author?',
  'licenses.a1': '[Answer: e.g. the video may get a Content ID claim — and how to clear it.]',
  'licenses.q2': 'Can I use a track in a video with ads?',
  'licenses.a2': '[Answer based on the standard license terms.]',
  'licenses.q3': 'How do I get an extended license?',
  'licenses.a3': '[Answer: send an email with the project and how the music will be used.]',
  'licenses.q4': 'Does the license cover sample packs?',
  'licenses.a4': '[Answer: samples have separate terms.]',
  'licenses.special': 'Special case?',
  'licenses.specialText': 'Tell me what project you need music for:',
  'licenses.contact': 'Get in touch',

  'empty.content.title': 'Looks like something is wrong with the site’s content!',
  'empty.content.note': 'Don’t worry, I’ll fix it soon.',
  'empty.tracks.title': 'No tracks have been uploaded yet!',
  'empty.tracks.note': 'Something may appear here soon!',
  'empty.packs.title': 'Nothing here yet!',
  'empty.packs.note': 'Something may appear here soon!',

  'error.home': 'Go home',
  'error.404.title': 'Page not found',
  'error.404.text': 'The release may have been renamed, or the address has a typo.',
  'error.403.title': 'Access denied',
  'error.403.text': 'This page is not available for viewing.',
  'error.500.title': 'Something broke',
  'error.500.text': 'A server error occurred. Please try refreshing the page a little later.',
  'error.503.title': 'Under maintenance',
  'error.503.text': 'Everything will be back soon — please check back a little later.',
};

export const ui: Record<Lang, Record<UiKey, string>> = { ru, en };

/** t('samples.count', { n: '24' }) → «24 сэмплов» */
export function useT(lang: Lang) {
  return (key: UiKey, vars: Record<string, string | number> = {}) =>
    ui[lang][key].replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

export function isLang(v: unknown): v is Lang {
  return langs.includes(v as Lang);
}

/** Язык по адресу страницы: /en/... → en, остальное → ru. */
export function langFromPath(pathname: string): Lang {
  const first = pathname.split('/')[1];
  return isLang(first) ? first : defaultLang;
}

/** Путь без языкового префикса: /en/about → /about */
export function stripLang(pathname: string): string {
  const first = pathname.split('/')[1];
  return isLang(first) && first !== defaultLang ? pathname.slice(first.length + 1) || '/' : pathname;
}

/** Ссылка на странице нужного языка: ('/about', 'en') → '/en/about', ('/#tracks', 'en') → '/en#tracks' */
export function localize(href: string, lang: Lang): string {
  if (lang === defaultLang || /^(https?:|mailto:)/.test(href)) return href;
  if (href === '/') return `/${lang}`;
  if (href.startsWith('/#')) return `/${lang}${href.slice(1)}`;
  return `/${lang}${href}`;
}

const locales: Record<Lang, string> = { ru: 'ru-RU', en: 'en-GB' };

export function formatDate(d: Date, exact: boolean, lang: Lang): string {
  if (!exact) return String(d.getUTCFullYear());
  return d.toLocaleDateString(locales[lang], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
