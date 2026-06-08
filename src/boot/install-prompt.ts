import { defineBoot } from '#q-app/wrappers';
import { registerInstallPrompt } from 'src/composables/useInstallPrompt';

// Регистрируем перехват beforeinstallprompt как можно раньше.
export default defineBoot(() => {
  registerInstallPrompt();
});
