---
# ШАБЛОН: пред-релиз — трек анонсирован, но ещё не вышел на площадках.
# Скопируй папку в contents_user/traks/RLS/ и переименуй. После выхода поменяй status на released,
# добавь ссылки на площадки, UPC и включи скачивание.

title: '[Название трека]'
date: 2026-12-31 # дата выхода; в списке «Музыка» трек встанет по ней
kind: single
status: prerelease # плашка «Пред-релизная»
composition: original
genre: Electronic
language: en
label: Arkomiko
# upc: '000000000000' — появится после отправки дистрибьютору
bpm: 140
key: F minor
tags: [Dubstep, Bass Music, Electronic, Coming Soon, Pre-release, Energy]
tracks:
  - title: '[Название трека]'
    status: prerelease
links: # пре-сейв и анонсы; после выхода замени на площадки
  youtube: https://www.youtube.com/watch?v=... # тизер
  soundcloud: https://soundcloud.com/arkomiko/... # превью
license:
  name: Arkomiko Music License
  url: /licenses#music
  streams: allowed
  monetization: allowed
  remixes: conditions
  credit: 'Music: Arkomiko — [Название трека]'
download: false # до релиза файл не раздаём
credits:
  - 'Music, mix, mastering: Arkomiko'
draft: true # поставь false, когда всё заполнено
---

[Анонс: когда выходит и где будет доступен. Первый абзац уходит в описание страницы.]
