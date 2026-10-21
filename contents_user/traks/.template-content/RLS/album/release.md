---
# ШАБЛОН: альбом или EP. Скопируй папку в contents_user/traks/RLS/ и переименуй (латиница, строчные, дефисы).
# Аудио — в tracks/ с номерами по порядку: 01-intro.mp3, 02-name.mp3… Порядок на сайте — по имени файла.
# Список tracks ниже идёт в том же порядке и задаёт название, BPM и статус каждого трека.

title: '[Название альбома]'
date: 2026-01-01 # оригинальная дата релиза
kind: album # album — альбом, ep — EP (обычно 3–6 треков)
status: released
composition: original
genre: Electronic
language: en # язык названия альбома
label: Arkomiko
upc: '000000000000' # UPC всего альбома
bpm: 140 # BPM для карточки альбома; у треков — свой ниже
key: F minor
tags: [Dubstep, Melodic Dubstep, Midtempo, Bass Music, Electronic, Cinematic, Dark, Emotional, Story]
tracks:
  - title: '[Трек 1 — Intro]'
    bpm: 100
  - title: '[Трек 2]'
    bpm: 140
  - title: '[Трек 3]'
    bpm: 150
  - title: '[Трек 4 — Outro]'
    bpm: 90
    status: prerelease # статус отдельного трека: released | prerelease | draft
links:
  spotify: https://open.spotify.com/album/...
  apple: https://music.apple.com/album/...
  yandex: https://music.yandex.ru/album/...
  vk: https://vk.com/music/album/...
  zvuk: https://zvuk.com/release/...
  youtubeMusic: https://music.youtube.com/playlist?list=...
  soundcloud: https://soundcloud.com/arkomiko/sets/...
  bandcamp: https://arkomiko.bandcamp.com/album/...
license:
  name: Arkomiko Music License
  url: /licenses#music
  streams: allowed
  monetization: allowed
  remixes: conditions
  credit: 'Music: Arkomiko — [Название трека] (из альбома [Название альбома])'
download: true # скачивается первый трек; архив альбома — ссылкой в описании
credits:
  - 'Music, mix, mastering: Arkomiko'
  - 'Featuring: [Имя гостя] — трек 3'
  - 'Cover art: [Художник]'
# placeholder: 5
draft: true # поставь false, когда всё заполнено
---

[Описание альбома: идея, история, о чём треки. Первый абзац уходит в описание страницы для поисковиков и соцсетей.]
