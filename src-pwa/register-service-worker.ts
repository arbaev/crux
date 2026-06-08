import { register } from 'register-service-worker';
import { Notify } from 'quasar';

// Строки prompt-обновления — вне Vue-i18n (SW-регистрация), поэтому RU-хардкод.
register(process.env.SERVICE_WORKER_FILE, {
  // Доступна новая версия: мягкий prompt вместо молчаливой подмены (§11.3).
  updated(registration) {
    Notify.create({
      message: 'Доступно обновление',
      caption: 'Загрузите свежую версию приложения',
      color: 'primary',
      icon: 'system_update',
      timeout: 0,
      position: 'bottom',
      actions: [
        {
          label: 'Обновить',
          color: 'white',
          handler: () => {
            registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
          },
        },
        { label: 'Позже', color: 'white' },
      ],
    });
  },

  error(err) {
    // Прогрессивное улучшение: сбой регистрации SW не ломает приложение.
    console.error('Service worker registration failed:', err);
  },
});

// Когда новый SW взял управление — один раз перезагружаем страницу на свежую версию.
let refreshing = false;
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (refreshing) return;
  refreshing = true;
  window.location.reload();
});
