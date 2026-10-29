# Контент: треки и материалы

[← К README](README.md)

Весь контент сайта лежит в папке `contents_user/`. Код его только читает: чтобы добавить трек или материал, программировать не нужно.

## Содержание

- [Структура папки](#структура-папки)
- [Шаблоны](#шаблоны)
- [Как добавить трек](#как-добавить-трек)
- [Поля release.md](#поля-releasemd)
- [Как добавить материал](#как-добавить-материал)
- [Поля pack.md](#поля-packmd)
- [Шаблонные обложки](#шаблонные-обложки)
- [Скрытый контент](#скрытый-контент)
- [Большие файлы](#большие-файлы)

## Структура папки

```
contents_user/
├── traks/RLS/<папка>/        релизы и пред-релизы   → «Музыка», /release/<папка>
├── traks/DR/<папка>/         черновики              → «Музыка», /release/<папка>
├── traks/.template-content/  шаблоны релизов        → сайтом не читаются
├── pack/.template-content/   шаблоны материалов     → сайтом не читаются
├── pack/Semples/<папка>/     сэмплы                 → «Материалы»
├── pack/Presets/<папка>/     пресеты                → «Материалы»
├── pack/Projects/<папка>/    проекты                → «Материалы»
├── pack/Collection/<папка>/  коллекции              → «Материалы»
└── licenses/*.md             полные тексты лицензий
```

## Шаблоны

Готовые `release.md` и `pack.md` со всеми полями, тегами и подсказками лежат в папках `.template-content`. Сайт их не читает, в репозитории они есть. Скопируй папку шаблона в нужный раздел, переименуй и заполни.

| Шаблон                                                                                                             | Для чего                                        |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| [`traks/.template-content/RLS/single/`](../../contents_user/traks/.template-content/RLS/single/release.md)         | сингл через дистрибьютора: UPC, лейбл, площадки |
| [`traks/.template-content/RLS/album/`](../../contents_user/traks/.template-content/RLS/album/release.md)           | альбом или EP                                   |
| [`traks/.template-content/RLS/prerelease/`](../../contents_user/traks/.template-content/RLS/prerelease/release.md) | пред-релиз                                      |
| [`traks/.template-content/RLS/cover/`](../../contents_user/traks/.template-content/RLS/cover/release.md)           | кавер                                           |
| [`traks/.template-content/RLS/remix/`](../../contents_user/traks/.template-content/RLS/remix/release.md)           | ремикс                                          |
| [`traks/.template-content/RLS/label/`](../../contents_user/traks/.template-content/RLS/label/release.md)           | релиз через лейбл                               |
| [`traks/.template-content/DR/techno-demo/`](../../contents_user/traks/.template-content/DR/techno-demo/release.md) | техно-демка или черновик                        |
| [`pack/.template-content/Semples/`](../../contents_user/pack/.template-content/Semples/sample-pack/pack.md)        | сэмпл-пак                                       |
| [`pack/.template-content/Presets/`](../../contents_user/pack/.template-content/Presets/preset-bank/pack.md)        | банк пресетов                                   |
| [`pack/.template-content/Projects/`](../../contents_user/pack/.template-content/Projects/daw-project/pack.md)      | проект DAW                                      |
| [`pack/.template-content/Collection/`](../../contents_user/pack/.template-content/Collection/collection/pack.md)   | коллекция из нескольких паков                   |

В шаблонах стоит `draft: true`: скопированный релиз или пак не появится на опубликованном сайте, пока ты не поставишь `false`.

## Как добавить трек

1. Создай папку в `contents_user/traks/RLS/` (релиз или пред-релиз) или в `contents_user/traks/DR/` (черновик).
2. Положи в неё:
   - `tracks/` с mp3-файлами. Порядок треков определяется именем файла: `01-intro.mp3`, `02-…`;
   - `release.md` с описанием;
   - `cover.jpg`, `.png` или `.webp` — квадрат от 1200×1200. Необязательно: без обложки подставится шаблонная.
3. Сохрани. Трек появится на главной, в разделе «Музыка» и в плеере.

Правила для имени папки:

- имя папки становится адресом страницы: `traks/RLS/4wio` → `/release/4wio`;
- только латиница в нижнем регистре, цифры и дефисы;
- после публикации папку не переименовывать, иначе сломаются ссылки;
- одинаковые имена в `RLS` и `DR` допустимы: адрес черновика получит суффикс `-draft`.

Название, длительность и BPM трека берутся из тегов mp3, если они не указаны в `release.md`. Каждый трек получает сквозной номер (001, 002…) по дате выхода.

## Поля release.md

```yaml
---
title: 4WIO
date: 2022
kind: single
status: prerelease
composition: original
genre: Dubstep
language: en
label: Arkomiko
upc: '123456789012'
bpm: 138
key: A minor
tags: [Energy, Dubstep, EDM]
tracks:
  - title: 4WIO
links:
  spotify: https://...
license:
  streams: allowed
  monetization: conditions
  remixes: conditions
  credit: 'Music: Arkomiko'
download: true
placeholder: 3
draft: false
---
Короткое описание. Используется в описании страницы для поисковиков и соцсетей.
```

| Поле          | Обязательное | Значения                                                                                                                                 | По умолчанию                                                                                    |
| ------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `title`       | да           | строка                                                                                                                                   | —                                                                                               |
| `date`        | да           | год (`2022`) или дата релиза (`2026-03-14`)                                                                                              | —                                                                                               |
| `kind`        | нет          | `single`, `album`, `ep`, `cover`, `techno-demo`                                                                                          | `RLS` — `single`, `DR` — `techno-demo`                                                          |
| `status`      | нет          | `released`, `prerelease`, `draft`                                                                                                        | `RLS` — `released`, `DR` — `draft`                                                              |
| `composition` | нет          | `original`, `cover`, `remix`                                                                                                             | `original`                                                                                      |
| `genre`       | нет          | строка                                                                                                                                   | —                                                                                               |
| `language`    | нет          | язык названия релиза: код `en`, `ru`, `ja`                                                                                               | —                                                                                               |
| `label`       | нет          | лейбл или правообладатель                                                                                                                | —                                                                                               |
| `upc`         | нет          | UPC/EAN релиза от дистрибьютора, 12–14 цифр, в кавычках                                                                                  | —                                                                                               |
| `bpm`         | нет          | число                                                                                                                                    | из тегов mp3                                                                                    |
| `key`         | нет          | строка, например `A minor`                                                                                                               | —                                                                                               |
| `tags`        | нет          | список строк; показываются чипами и участвуют в поиске                                                                                   | `[]`                                                                                            |
| `tracks`      | нет          | список `{ title, bpm, status }` по порядку файлов                                                                                        | из тегов mp3                                                                                    |
| `links`       | нет          | `spotify`, `apple`, `yandex`, `vk`, `youtube`, `youtubeMusic`, `soundcloud`, `bandcamp`, `deezer`, `zvuk`, `mts`, `audset`               | —                                                                                               |
| `license`     | нет          | `name`, `url` — название и ссылка на текст; `streams`, `monetization`, `remixes`: `allowed`, `conditions`, `forbidden`; `credit`: строка | техно-демки и `DR` — CC BY-NC-SA 4.0, остальное — Arkomiko Music License (`src/site.config.ts`) |
| `download`    | нет          | `true` или `false` — кнопка «Скачать»                                                                                                    | `true`                                                                                          |
| `credits`     | нет          | список строк                                                                                                                             | `[]`                                                                                            |
| `placeholder` | нет          | номер шаблонной обложки, `1`–`8`                                                                                                         | вычисляется от имени папки                                                                      |
| `draft`       | нет          | `true` — скрыть с опубликованного сайта                                                                                                  | `false`                                                                                         |

Если указан хотя бы один из `language`, `label`, `upc`, на странице релиза появляется блок «О релизе»: тип, дата, жанр, язык названия, лейбл и UPC.

Схема полей описана в `src/content.config.ts`.

## Как добавить материал

1. Создай папку в `contents_user/pack/<тип>/`, где тип — `Semples`, `Presets`, `Projects` или `Collection`. Тип материала задаёт папка.
2. Положи в неё `pack.md` и при желании `cover.jpg` (квадрат).
3. Сам архив залей на Boosty, Patreon, Ko-fi или в облако и вставь ссылку в `download`. У бесплатного пака на карточке кнопка «Скачать», у платного — «Приобрести».

Шаблоны со всеми полями — в `contents_user/pack/.template-content/`, см. [Шаблоны](#шаблоны). Образец — `contents_user/pack/Semples/example-pack/` (скрыт, виден только в `npm run dev`).

## Поля pack.md

| Поле          | Обязательное | Значения                                                                | По умолчанию                            |
| ------------- | ------------ | ----------------------------------------------------------------------- | --------------------------------------- |
| `title`       | да           | строка                                                                  | —                                       |
| `date`        | да           | год или дата                                                            | —                                       |
| `count`       | нет          | число: сэмплов, пресетов, проектов или файлов — по типу папки           | —                                       |
| `bpm`         | нет          | строка, например `'140'` или `'120–140'`                                | —                                       |
| `key`         | нет          | строка                                                                  | —                                       |
| `genre`       | нет          | строка                                                                  | —                                       |
| `format`      | нет          | строка, например `WAV 24-bit`, `Serum`                                  | —                                       |
| `tags`        | нет          | список строк; на карточке первые 4, остальные в чипе «+N», в поиске все | `[]`                                    |
| `price`       | нет          | `free` или цена строкой, например `'500 ₽'`                             | `free`                                  |
| `license`     | нет          | `free`, `standard`, `extended` — плашка со ссылкой на условия           | `free` для бесплатных, иначе `standard` |
| `download`    | нет          | ссылка на архив или страницу на Boosty, Patreon, Ko-fi                  | —                                       |
| `placeholder` | нет          | номер шаблонной обложки                                                 | вычисляется от имени папки              |
| `draft`       | нет          | `true` — скрыть с опубликованного сайта                                 | `false`                                 |

## Шаблонные обложки

Если в папке трека или материала нет `cover.*`, сайт подставляет шаблонную обложку из `src/assets/placeholders/`:

| Набор     | Для чего             |
| --------- | -------------------- |
| `Track`   | релизы и пред-релизы |
| `Draft`   | черновики            |
| `Samples` | материалы            |

- Номер шаблона вычисляется от имени папки и не меняется, когда добавляются или удаляются другие треки.
- Файл в папку трека не копируется.
- Выбрать шаблон вручную — поле `placeholder: 1…8`.
- Своя `cover.jpg` в папке заменяет шаблон.

В каждом наборе: `png/` — с подписью для русской версии, `no-text/png/` — без подписи для английской версии и плеера, `svg/` — исходники. Новый вариант шаблона — пара файлов с одинаковым именем в `png/` и `no-text/png/`.

## Скрытый контент

`draft: true` скрывает трек или материал на опубликованном сайте, в `npm run dev` он виден. Скрытые материалы не учитываются при проверке пустых разделов: если других материалов нет, «Материалы» покажут пустое состояние.

## Большие файлы

GitHub не принимает файлы больше 100 МБ, а репозиторий с аудио быстро растёт.

- Для сайта достаточно mp3 192–320 kbps.
- WAV и FLAC для скачивания храни отдельно, например в Cloudflare R2, и указывай ссылкой.
