import { describe, it, expect } from 'vitest';
import type { BoardConfig } from 'src/types/board';
import { buildHoldPositions, cellIndex, holdId } from 'src/lib/board';

const config: BoardConfig = { id: 't', cols: 8, rows: 12, spacing: 1, angle: 0 };

describe('buildHoldPositions', () => {
  it('генерирует cols*rows позиций', () => {
    expect(buildHoldPositions(config)).toHaveLength(8 * 12);
  });

  it('первая позиция — это (0,0) с верным id', () => {
    const positions = buildHoldPositions(config);
    expect(positions[0]?.id).toBe(holdId(0, 0));
    expect(positions[0]?.col).toBe(0);
    expect(positions[0]?.row).toBe(0);
  });

  it('сетка центрирована по X (крайние столбцы симметричны)', () => {
    const positions = buildHoldPositions(config);
    const leftX = positions.find((p) => p.col === 0 && p.row === 0)?.x ?? 0;
    const rightX = positions.find((p) => p.col === 7 && p.row === 0)?.x ?? 0;
    expect(leftX).toBeCloseTo(-rightX);
  });

  it('cellIndex согласован с раскладкой', () => {
    expect(cellIndex(0, 0, 8)).toBe(0);
    expect(cellIndex(4, 1, 8)).toBe(12);
  });
});
