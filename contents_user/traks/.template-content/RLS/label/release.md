---
# ШАБЛОН: релиз через лейбл. Скопируй папку в contents_user/traks/RLS/ и переименуй.
# На такой трек действуют условия лейбла, а не Arkomiko Music License: впиши их в блок license.

title: '[Название трека]'
date: 2026-01-01
kind: single
status: released
composition: original
genre: Electronic
language: en
label: '[Название лейбла]' # лейбл из договора
upc: '000000000000' # UPC выдаёт лейбл
bpm: 140
key: F minor
tags: [Dubstep, Bass Music, Electronic, '[Название лейбла]', Label Release, Energy]
tracks:
  - title: '[Название трека]'
links:
  spotify: https://open.spotify.com/album/...
  apple: https://music.apple.com/album/...
  yandex: https://music.yandex.ru/album/...
  youtube: https://www.youtube.com/watch?v=... # канал лейбла
  bandcamp: https://label.bandcamp.com/track/...
license:
  name: 'Условия лейбла [Название лейбла]'
  url: https://example.com/licensing # страница лицензирования лейбла; можно не указывать
  streams: conditions # как разрешает лейбл
  monetization: conditions
  remixes: forbidden # ремиксы — через лейбл
  credit: 'Music: Arkomiko — [Название трека] / [Название лейбла]'
download: false # скачивание обычно запрещает договор
credits:
  - 'Music: Arkomiko'
  - 'Label: [Название лейбла]'
  - 'Mastering: [Кто делал мастеринг]'
draft: true # поставь false, когда всё заполнено
---

[Пара слов о релизе и лейбле. Первый абзац уходит в описание страницы.]
