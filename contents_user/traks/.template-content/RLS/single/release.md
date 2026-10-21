---
# ШАБЛОН: сингл, выпущенный через дистрибьютора (FreshTunes и другие).
# Скопируй папку в contents_user/traks/RLS/ и переименуй: латиница, строчные, дефисы — это адрес страницы.
# Рядом: cover.jpg (квадрат от 1200×1200) и tracks/01-<папка>.mp3. Обязательны только title и date.

title: '[Название трека]' # как на площадках
date: 2026-01-01 # оригинальная дата релиза (ГГГГ-ММ-ДД); если известен только год — date: 2026
kind: single # single | ep | album | cover | techno-demo
status: released # released — релизная, prerelease — пред-релизная, draft — черновик
composition: original # original — своя, cover — кавер, remix — ремикс
genre: Electronic # жанр, указанный у дистрибьютора
language: en # язык названия: en, ru, ja… (блок «О релизе»)
label: Arkomiko # лейбл / копирайт (блок «О релизе»)
upc: '000000000000' # UPC/EAN от дистрибьютора, 12–14 цифр, обязательно в кавычках
bpm: 140 # можно не писать: возьмётся из тегов mp3
key: F minor # тональность
# Теги: жанры, настроение, где использовать. Показываются на странице и участвуют в поиске.
tags: [Dubstep, Riddim, Bass Music, Electronic, EDM, Energy, Aggressive, Heavy, Gaming, Workout]
tracks: # названия и BPM по порядку файлов в tracks/ — если в тегах mp3 неудачное название
  - title: '[Название трека]'
    bpm: 140
links: # ссылки на площадки; порядок на странице — как здесь
  spotify: https://open.spotify.com/album/...
  apple: https://music.apple.com/album/...
  yandex: https://music.yandex.ru/album/...
  vk: https://vk.com/audio...
  zvuk: https://zvuk.com/track/...
  mts: https://music.mts.ru/album/...
  youtube: https://www.youtube.com/watch?v=...
  youtubeMusic: https://music.youtube.com/playlist?list=...
  soundcloud: https://soundcloud.com/arkomiko/...
  bandcamp: https://arkomiko.bandcamp.com/track/...
  deezer: https://www.deezer.com/album/...
  audset: https://audset.ru/album/...
license: # без этого блока — Arkomiko Music License с теми же значениями
  name: Arkomiko Music License
  url: /licenses#music
  streams: allowed # allowed — можно, conditions — с условиями, forbidden — нельзя
  monetization: allowed
  remixes: conditions # по согласованию с автором
  credit: 'Music: Arkomiko — [Название трека]'
download: true # кнопка «Скачать» на странице релиза
credits: # участники релиза (пока на сайте не выводятся)
  - 'Music, mix, mastering: Arkomiko'
  - 'Cover art: Arkomiko'
# placeholder: 3 # номер шаблонной обложки 1–8, если своей cover.* нет; без поля номер считается от имени папки
draft: true # true — виден только в npm run dev; поставь false, когда всё заполнено
---

[Короткое описание трека в 1–2 предложения. Первый абзац уходит в описание страницы для поисковиков и соцсетей.]
