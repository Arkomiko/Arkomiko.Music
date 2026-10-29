<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../RU-ru/assets/banner-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="../RU-ru/assets/banner-light.svg">
  <img src="../RU-ru/assets/banner-dark.svg" alt="Arkomiko Music — music showcase website template on Astro and Vue" width="100%">
</picture>

[Русский](../RU-ru/README.md) · **English**

</div>

A music player website template for musicians: releases, techno demos, covers, sample packs and licenses. A static site on Astro, a player with a spectrum analyzer on Vue, Russian and English versions, dark and light themes. It powers the Arkomiko website — [arkomiko.net](https://arkomiko.net).

The repository holds only the base: no music, biography or personal data of the author. Your name, domain, social links and texts go to `contents_user/profile/`, your tracks to `contents_user/traks/`; neither folder is committed to git.

> [!IMPORTANT]
> This is not a product for copying 1:1. Selling the code or building sites on it for clients is not allowed; the logo, mascot, illustrations, music and the Arkomiko name are not covered by the code license. Read the usage rules ([USAGE.md](../RU-ru/USAGE.md), in Russian) before publishing your site.

## Quick start

Node.js 22 or newer is required.

```bash
git clone https://github.com/Arkomiko/Arkomiko.Music.git
cd Arkomiko.Music
npm install
npm run dev        # http://localhost:4321
```

Your profile: copy `contents_user/profile/.template-content/` to `contents_user/profile/` and fill in your name, domain, social links and texts.

| Command                  | What it does                                    |
| ------------------------ | ----------------------------------------------- |
| `npm run dev`            | local server with hot reload                    |
| `npm run build`          | builds the site into `dist/`                    |
| `npm run preview`        | previews the built `dist/`                      |
| `npm run check`          | type and template check (`astro check`)         |
| `npm run format`         | Prettier formatting                             |
| `npm run deploy`         | site archive for hosting: `deploy/<domain>.zip` |
| `npm run push -- "text"` | check, commit and push to GitHub                |

In VS Code all of this is in the Run and Debug panel (F5): «Deploy: архив для хостинга» (hosting archive), «GitHub: залить изменения» (push changes) and the dev server.

## Project structure

| Path                      | What is inside                                                                   |
| ------------------------- | -------------------------------------------------------------------------------- |
| `contents_user/traks/`    | tracks: `RLS/` releases, `DR/` drafts; only templates are committed              |
| `contents_user/pack/`     | sample packs, presets, projects, collections                                     |
| `contents_user/profile/`  | name, domain, social links, home and biography texts; only a sample is committed |
| `contents_user/licenses/` | full license texts                                                               |
| `src/`                    | site code: Astro pages and views, Vue player, styles, assets                     |
| `languages/`              | translations, one file per language; `RU-ru.ts` is the main one                  |
| `GiDo/`                   | repository documentation, one folder per language                                |
| `public/`                 | favicons and `.htaccess` for Apache hosting                                      |
| `.github/`                | repository front page, build and release workflows, issue templates              |
| `.vscode/`                | F5 launch, Deploy, push to GitHub, editor settings                               |

## Usage and attribution

Allowed: study the code, build your own site with your own music and texts on it, sell your own works through it, change anything in the code.

Required:

- keep `LICENSE` and `GiDo/RU-ru/NOTICE.md` with the Arkomiko copyright in every copy of the code;
- keep the footer credit with a link to the repository on every page: «Works on Astro and Vue. Built on the Arkomiko repo»;
- replace all of the author's materials with your own.

Not allowed: selling the code as a template, building sites on it for clients, using the logo, mascot, illustrations, music and the Arkomiko name, presenting your site as the Arkomiko site.

| What                              | License                                                             |
| --------------------------------- | ------------------------------------------------------------------- |
| Site code                         | [Arkomiko.Music Code License 1.0](../../LICENSE)                    |
| Name, logo, mascot, illustrations | all rights reserved, fan art allowed — [NOTICE](../RU-ru/NOTICE.md) |
| Placeholder covers                | CC BY-NC 4.0                                                        |
| Dependencies and fonts            | their authors' licenses                                             |

The detailed documentation is in Russian for now: [GiDo/RU-ru](../RU-ru/README.md).

## Contact

Code questions and bugs — via [Issues](https://github.com/Arkomiko/Arkomiko.Music/issues). Support the author: [Boosty](https://boosty.to/arkomiko) · [Patreon](https://www.patreon.com/cw/Arkomiko) · [Ko-fi](https://ko-fi.com/arkomiko).
