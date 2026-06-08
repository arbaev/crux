# Иконки Crux

Источник логотипа — `public/favicon.svg`. Текущий набор сгенерирован на realfavicongenerator.net.

| Файл | Размер | Назначение |
|------|--------|-----------|
| `../favicon.svg` | вектор | favicon в табе (современные браузеры), `manifest.icons` |
| `../favicon.ico` | 16/32/48 | favicon-фолбэк (старые браузеры) |
| `favicon-96x96.png` | 96×96 | PNG-favicon |
| `apple-touch-icon.png` | 180×180 | иконка на home screen iOS |
| `web-app-manifest-192x192.png` | 192×192 | PWA-иконка (`any` + `maskable`, отдельными записями) |
| `web-app-manifest-512x512.png` | 512×512 | PWA-иконка (`any` + `maskable`, отдельными записями) |

Имена жёстко связаны с `src-pwa/manifest.json` и `index.html` — при регенерации сохраняй их.
`injectPwaMetaTags` в `quasar.config.ts` **выключен**: manifest-link, `theme-color` и иконки
подключены вручную в `index.html`.

**Перегенерация:** загрузи `public/favicon.svg` на realfavicongenerator.net → скачай набор →
замени файлы с теми же именами.
