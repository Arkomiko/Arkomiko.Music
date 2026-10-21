---
# ШАБЛОН: сэмпл-пак. Скопируй папку в contents_user/pack/Semples/ и переименуй (латиница, строчные, дефисы).
# Рядом — cover.jpg (квадрат от 1200×1200). Обязательны только title и date.

title: '[Название пака] Vol. 1'
date: 2026-01-01 # дата выхода; можно только год: 2026
count: 120 # сколько сэмплов в архиве — на карточке «120 сэмплов»
bpm: '140–150' # строкой: '140' или диапазон
key: 'F minor, A minor' # тональности лупов; для драмов можно не писать
genre: Dubstep
format: 'WAV 24-bit / 44.1 kHz' # формат файлов
# Теги: состав, жанры, настроение. Показываются чипами и участвуют в поиске.
tags: [Drums, Kicks, Snares, Hi-Hats, Loops, One-Shots, Bass, FX, Riddim, Heavy]
price: free # free — бесплатно; платный — цена строкой: '500 ₽', '$5'
license: free # free | standard | extended; без поля: free для бесплатных, иначе standard
download: https://boosty.to/arkomiko # бесплатный пак — кнопка «Скачать», платный — «Приобрести»
# placeholder: 2 # номер шаблонной обложки 1–8, если своей cover.* нет
draft: true # true — виден только в npm run dev; поставь false, когда всё заполнено
---

[Короткое описание пака: для какого звучания, чем отличается.]

## Состав

- Drums — [40] файлов: kicks, snares, claps, hi-hats, percussion
- Loops — [30] файлов: drum loops, bass loops, melodic loops (BPM и тональность в названии)
- One-shots — [30] файлов: bass, leads, stabs
- FX — [20] файлов: risers, impacts, sweeps, downlifters

Названия файлов: `[Пак]_[Категория]_[Название]_[BPM]_[Тональность].wav`.

## Условия

Лицензия Free: можно в своей музыке без отчислений. В свои паки, в том числе платные, — с подписью для каждого файла:
`Arkomiko - [Название пака] - [Название файла]`. Полный текст — contents_user/licenses/free.md.
