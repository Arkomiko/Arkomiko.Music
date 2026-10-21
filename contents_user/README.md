# contents_user

Весь контент сайта. Код его только читает: добавлять и менять контент можно без программирования.

```
traks/RLS/<папка>/        релизы и пред-релизы   → «Музыка», /release/<папка>
traks/DR/<папка>/         черновики              → «Музыка», /release/<папка>
pack/Semples/<папка>/     сэмплы                 → «Материалы»
pack/Presets/<папка>/     пресеты
pack/Projects/<папка>/    проекты
pack/Collection/<папка>/  коллекции
licenses/*.md             полные тексты лицензий: музыка, демо, Free, Standard, Extended
```

- Шаблоны со всеми полями — в [`traks/.template-content/`](traks/.template-content/) и [`pack/.template-content/`](pack/.template-content/): сайт их не читает, копируй и заполняй.
- В папке трека: `release.md`, `tracks/01-название.mp3`, `cover.jpg` (необязательно).
- В папке материала: `pack.md` и `cover.jpg` (необязательно).
- Без обложки сайт подставит шаблонную и закрепит её за папкой. Выбрать шаблон вручную — `placeholder: 3`.

Все поля и правила — в [Git-And-Docks/RU-ru/CONTENT.md](../Git-And-Docks/RU-ru/CONTENT.md).

Музыка, обложки и тексты в этой папке не входят в лицензию кода. Условия — на странице каждого релиза и в [`licenses/`](licenses/); сводка — в [NOTICE.md](../NOTICE.md).
