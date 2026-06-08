import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// Отдельный конфиг для unit-тестов чистых функций (без Quasar/Vue/DOM).
export default defineConfig({
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});
