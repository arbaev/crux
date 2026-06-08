# Сборка Android APK (Capacitor)

Crux собирается в нативный Android-APK через **Capacitor**: тот же веб-билд заворачивается в
WebView-оболочку, ассеты упаковываются внутрь APK (офлайн, без верификации домена). Веб-/PWA-деплой
на GitHub Pages это **не затрагивает** — `publicPath` для capacitor автоматически становится
относительным (`quasar.config.ts`).

> Capacitor-режим уже подключён: App ID **`com.arbaev.crux`**, имя **`Crux`** (`/src-capacitor`).
> Финальная сборка APK выполняется **локально** — в CI/этом окружении Android SDK нет.

## 0. WSL2 (Win10): рекомендуемый порядок — всё в Linux (CLI)

Проект и node-тулчейн уже в WSL2 → собираем там же, **без Android Studio GUI** (для APK нужны
только JDK + SDK + gradle). Не смешивай стороны WSL/Windows — главный источник проблем.

> **Capacitor 8 требует JDK 21** (в системе сейчас JDK 11 — обновляем).

**1. JDK 21**
```bash
sudo apt update && sudo apt install -y openjdk-21-jdk unzip curl
sudo update-alternatives --config java   # выбрать java-21, если стоят несколько
java -version                            # должно показать 21
```
(Если `openjdk-21-jdk` не нашёлся — поставь Temurin 21 с adoptium.net.)

**2. Android command-line tools + SDK** (без Studio)
```bash
cd /tmp
# Возьми актуальную ссылку «Command line tools only» (Linux) со страницы:
#   https://developer.android.com/studio#command-line-tools
curl -O https://dl.google.com/android/repository/commandlinetools-linux-<BUILD>_latest.zip
unzip -q commandlinetools-linux-*_latest.zip          # создаст /tmp/cmdline-tools
# ВАЖНО: бинарь должен лечь в cmdline-tools/latest/bin (а НЕ cmdline-tools/bin) —
# иначе sdkmanager неверно вычислит корень SDK.
mkdir -p "$HOME/Android/Sdk/cmdline-tools"
mv /tmp/cmdline-tools "$HOME/Android/Sdk/cmdline-tools/latest"
chmod +x "$HOME/Android/Sdk/cmdline-tools/latest/bin/"*   # вернуть флаг исполняемости
```

**3. Переменные окружения** — добавить в `~/.zshrc`, затем `source ~/.zshrc`
```bash
export JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools"
```

**4. SDK-пакеты + лицензии**
```bash
sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"
yes | sdkmanager --licenses
# если gradle позже попросит другой API/build-tools — доставь его тем же sdkmanager
```

**5. Сборка APK**
```bash
cd /home/tim/crux
pnpm exec quasar build -m capacitor -T android   # билд web + cap sync (создаст src-capacitor/android)
# Может попытаться открыть Android Studio — игнорируй, проект уже синхронизирован.
cd src-capacitor/android
./gradlew assembleDebug
# → app/build/outputs/apk/debug/app-debug.apk
```

**6. APK на телефон** (проще всего — файлом)
```bash
cp app/build/outputs/apk/debug/app-debug.apk /mnt/c/Users/<WinUser>/Downloads/
```
Перекинь файл на телефон (USB/облако), включи «Установка из неизвестных источников», тапни APK.
(Для итеративной отладки можно `adb` через usbipd-win или Wi-Fi-debugging — но для первого APK не нужно.)

---

## 1. Пререквизиты (один раз)

- **JDK 17** (Android Gradle Plugin требует именно 17).
- **Android Studio** + через **SDK Manager** поставить: Android SDK Platform (API 34+),
  Android SDK Build-Tools, Platform-Tools.
- Переменные окружения:
  ```bash
  export ANDROID_HOME="$HOME/Android/Sdk"        # путь к SDK
  export ANDROID_SDK_ROOT="$ANDROID_HOME"
  export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools"
  ```
- Принять лицензии: `sdkmanager --licenses`.

## 2. Сборка

```bash
pnpm install                                   # если ещё не
pnpm exec quasar build -m capacitor -T android
```

Что делает команда: собирает веб (с относительными путями) → копирует в `src-capacitor` →
при первом запуске сам выполнит `cap add android` (создаст `src-capacitor/android/`) → откроет
Android Studio.

> ⚠️ **Android Studio предложит обновить Gradle — ОТКАЗАТЬСЯ.** Обновление ломает Capacitor-проект
> (официальная заметка Quasar).

### Debug-APK (для сайдлоада / себе)

В Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
Или из CLI:
```bash
cd src-capacitor/android
./gradlew assembleDebug
# → app/build/outputs/apk/debug/app-debug.apk
adb install -r app/build/outputs/apk/debug/app-debug.apk   # установить на подключённое устройство
```

### Release-APK / AAB (для распространения / Play Store)

1. Создать keystore (один раз, хранить надёжно — потеря = невозможность обновлять приложение):
   ```bash
   keytool -genkey -v -keystore crux-release.keystore -alias crux \
     -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Прописать подпись в `src-capacitor/android/app/build.gradle` (`signingConfigs`) или через
   `~/.gradle/gradle.properties` (не коммитить ключи/пароли!).
3. Собрать:
   ```bash
   cd src-capacitor/android
   ./gradlew assembleRelease     # подписанный APK
   ./gradlew bundleRelease       # AAB для Google Play
   ```

## 3. Иконки и splash под Android

Нативные иконки/сплеш генерируются отдельно от веб-иконок — инструментом `@capacitor/assets`
из исходного изображения **1024×1024 PNG**:

```bash
# подготовить исходник: public/favicon.svg → 1024×1024 PNG (любой конвертер), положить в:
#   assets/icon-only.png        (1024×1024)
#   assets/splash.png           (2732×2732, опц.)
pnpm dlx @capacitor/assets generate --android --assetPath assets
```

(Сгенерит mipmap-иконки и splash в `src-capacitor/android/app/src/main/res/...`.)

## 4. Заметки

- **hash-роутер** уже Capacitor-совместим (`file://`) — менять не нужно.
- **Service worker / PWA** в нативной сборке не используются (ассеты локальные) — это нормально;
  кнопка «Установить» в нативе скрыта (`beforeinstallprompt` не срабатывает).
- **Белый экран** в APK почти всегда = неотносительный `publicPath`. У нас он уже относительный
  для capacitor (см. `quasar.config.ts`) — если правил конфиг, проверь это в первую очередь.
- Нативный проект `src-capacitor/android/` можно коммитить (конфиг/подпись персистятся);
  build-артефакты и `local.properties` — в `.gitignore`.
