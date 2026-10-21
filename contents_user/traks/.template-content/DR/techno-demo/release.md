---
# ШАБЛОН: техно-демка или черновик. Скопируй папку в contents_user/traks/DR/ и переименуй.
# Если в RLS/ уже есть папка с таким именем, адрес демки получит суффикс -draft.
# Лицензия по умолчанию — CC BY-NC-SA 4.0: можно некоммерчески слушать, переделывать и делиться.
# Если демка потом выйдет релизом, демо-версию удаляют с сайта (см. contents_user/licenses/demo.md).

title: '[Название демки]'
date: 2026 # для демки достаточно года; точная дата — 2026-01-01
kind: techno-demo
status: draft # плашка «Черновик»
composition: original
genre: Dubstep
bpm: 140
key: F minor
tags: [Demo, Work in Progress, Dubstep, Experimental, Sound Design, Electronic, Free Use]
tracks:
  - title: '[Название демки] (Demo)'
    status: draft
# links: — у демки обычно нет площадок; SoundCloud можно добавить
#   soundcloud: https://soundcloud.com/arkomiko/...
license: # без этого блока — CC BY-NC-SA 4.0 с теми же значениями
  name: CC BY-NC-SA 4.0
  url: /licenses#demo
  streams: allowed
  monetization: forbidden # NC — только некоммерческое использование
  remixes: allowed # некоммерчески и по той же лицензии
  credit: 'Music: Arkomiko — [Название демки] (Demo), CC BY-NC-SA 4.0'
download: true
credits:
  - 'Music: Arkomiko'
draft: true # true — видна только в npm run dev; поставь false, когда всё заполнено
---

[Что это за демка: идея, чего не хватает до релиза. Первый абзац уходит в описание страницы.]
