import { describe, it, expect } from 'vitest';
import type { RouteHold } from 'src/types/board';
import { encodeHolds, decodeRoute } from 'src/lib/routeCodec';

const COLS = 8;
const ROWS = 12;

// Множество "holdId:role" для сравнения без учёта порядка.
function holdSet(holds: RouteHold[]): Set<string> {
  return new Set(holds.map((h) => `${h.holdId}:${h.role}`));
}

describe('routeCodec', () => {
  it('round-trip: decode(encode(holds)) сохраняет раскладку', () => {
    const holds: RouteHold[] = [
      { holdId: '4-1', role: 'start' }, // idx = 1*8+4 = 12
      { holdId: '3-2', role: 'hand' }, // idx = 19
      { holdId: '7-2', role: 'hand' }, // idx = 23
      { holdId: '3-8', role: 'finish' }, // idx = 67
      { holdId: '0-0', role: 'foot' }, // idx = 0
    ];
    const decoded = decodeRoute(encodeHolds(holds, COLS, ROWS));
    expect(decoded).not.toBeNull();
    expect(decoded?.cols).toBe(COLS);
    expect(decoded?.rows).toBe(ROWS);
    expect(holdSet(decoded?.holds ?? [])).toEqual(holdSet(holds));
  });

  it('формат соответствует спеке §7 (пример 7x10)', () => {
    const holds: RouteHold[] = [
      { holdId: '5-1', role: 'start' }, // 7 cols: idx = 1*7+5 = 12
      { holdId: '5-2', role: 'hand' }, // idx = 19
      { holdId: '2-3', role: 'hand' }, // idx = 23
      { holdId: '4-9', role: 'finish' }, // idx = 67
    ];
    expect(encodeHolds(holds, 7, 10)).toBe('v1.7x10.12S,19H,23H,67T');
  });

  it('пустая трасса кодируется/декодируется', () => {
    const payload = encodeHolds([], COLS, ROWS);
    expect(payload).toBe('v1.8x12.');
    const decoded = decodeRoute(payload);
    expect(decoded).not.toBeNull();
    expect(decoded?.holds).toEqual([]);
  });

  it('детерминированный порядок токенов (по cellIndex)', () => {
    const a = encodeHolds(
      [
        { holdId: '7-2', role: 'hand' },
        { holdId: '4-1', role: 'start' },
      ],
      COLS,
      ROWS,
    );
    const b = encodeHolds(
      [
        { holdId: '4-1', role: 'start' },
        { holdId: '7-2', role: 'hand' },
      ],
      COLS,
      ROWS,
    );
    expect(a).toBe(b);
  });

  it.each([
    ['', 'пустая строка'],
    ['garbage', 'мусор без точек'],
    ['v1.8x12', 'нет секции токенов'],
    ['x1.8x12.0S', 'плохая версия'],
    ['v1.8.0S', 'плохие размеры'],
    ['v1.8x12.0Z', 'неизвестная роль'],
    ['v1.8x12.abc', 'нечисловой индекс'],
    ['v1.8x12.999S', 'индекс вне диапазона'],
  ])('невалидный payload "%s" (%s) -> null', (payload) => {
    expect(decodeRoute(payload)).toBeNull();
  });
});
