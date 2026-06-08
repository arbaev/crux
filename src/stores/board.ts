// Стор доски: конфиг раскладки + сгенерированные позиции зацепов. Чистые данные.
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { BoardConfig } from 'src/types/board';
import { buildHoldPositions } from 'src/lib/board';

export const useBoardStore = defineStore('board', () => {
  // В MVP — одна глобальная раскладка доски (8×12).
  const config = ref<BoardConfig>({
    id: 'default-8x12',
    cols: 8,
    rows: 12,
    spacing: 1,
    angle: 0,
  });

  const positions = computed(() => buildHoldPositions(config.value));

  return { config, positions };
});
