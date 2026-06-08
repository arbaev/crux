/*
 * Кастомный service worker (workboxMode: 'InjectManifest').
 * Стратегия обновления — prompt-on-update (§11.3): SW НЕ делает skipWaiting автоматически,
 * а ждёт сообщения SKIP_WAITING из UI (см. register-service-worker.ts) — чтобы не подменять
 * ассеты в середине сессии и не залипать на старом кеше.
 */

declare const self: ServiceWorkerGlobalScope & typeof globalThis & { skipWaiting: () => Promise<void> };

import { clientsClaim } from 'workbox-core';
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';

clientsClaim();

// Прекеш оболочки и ассетов (манифест подставляет Workbox при сборке).
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// SPA-фолбэк: навигационные запросы отдаём из прекешированного index.html.
if (process.env.PROD) {
  registerRoute(
    new NavigationRoute(createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML), {
      denylist: [new RegExp(process.env.PWA_SERVICE_WORKER_REGEX), /workbox-(.)*\.js$/],
    }),
  );
}

// Активировать новый SW только по явному запросу из UI (кнопка «Обновить»).
self.addEventListener('message', (event) => {
  const data = event.data as { type?: string } | undefined;
  if (data?.type === 'SKIP_WAITING') {
    void self.skipWaiting();
  }
});
