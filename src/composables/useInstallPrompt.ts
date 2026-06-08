// Ненавязчивая установка PWA (§11.4): перехватываем beforeinstallprompt, гасим автобаннер
// и предлагаем установку только по явному действию (кнопка в хедере).
import { ref, readonly } from 'vue';

// beforeinstallprompt отсутствует в стандартных DOM-типах — опишем минимально.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const canInstall = ref(false);

// Регистрируется из boot — рано, до возможного события.
export function registerInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // гасим дефолтный баннер
    deferredPrompt = e as BeforeInstallPromptEvent;
    canInstall.value = true;
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    canInstall.value = false;
  });
}

export function useInstallPrompt() {
  async function promptInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    canInstall.value = false;
  }
  return { canInstall: readonly(canInstall), promptInstall };
}
