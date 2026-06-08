// Генерация позиций зацепов из BoardConfig (см. спеку §6). Чистые функции.
import type { BoardConfig, HoldPosition } from 'src/types/board';

// Выступ зацепа над плоскостью стены (мировые единицы).
export const HOLD_DEPTH = 0.15;

// Стабильный id зацепа по координатам сетки.
export function holdId(col: number, row: number): string {
  return `${col}-${row}`;
}

// Индекс ячейки для компактного кодирования трассы (используется кодеком на M3).
export function cellIndex(col: number, row: number, cols: number): number {
  return row * cols + col;
}

/**
 * Маппинг сетки cols×rows в мировые координаты:
 *  - x центрируется по горизонтали;
 *  - y: row 0 — сверху;
 *  - z: небольшой выступ от плоскости стены.
 */
export function buildHoldPositions(config: BoardConfig): HoldPosition[] {
  const { cols, rows, spacing } = config;
  const positions: HoldPosition[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({
        id: holdId(col, row),
        col,
        row,
        x: (col - (cols - 1) / 2) * spacing,
        y: ((rows - 1) / 2 - row) * spacing,
        z: HOLD_DEPTH,
      });
    }
  }
  return positions;
}
