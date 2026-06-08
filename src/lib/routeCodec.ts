// Кодирование/декодирование трассы в компактную строку для шаринга (см. спеку §7).
// Чистые функции, без Vue/Three — покрыты unit-тестами (round-trip).
import type { BoardConfig, HoldRole, Route, RouteHold } from 'src/types/board';
import { cellIndex, holdId } from 'src/lib/board';

const VERSION = 'v1';

const ROLE_TO_CHAR: Record<HoldRole, string> = {
  start: 'S',
  hand: 'H',
  foot: 'F',
  finish: 'T',
};

const CHAR_TO_ROLE: Record<string, HoldRole> = {
  S: 'start',
  H: 'hand',
  F: 'foot',
  T: 'finish',
};

export interface DecodedRoute {
  version: string;
  cols: number;
  rows: number;
  holds: RouteHold[];
}

// holdId формата `${col}-${row}` -> [col, row] (или null при неверном формате).
function parseHoldId(id: string): [number, number] | null {
  const m = /^(\d+)-(\d+)$/.exec(id);
  if (!m || m[1] === undefined || m[2] === undefined) return null;
  return [Number(m[1]), Number(m[2])];
}

// "v1.<cols>x<rows>.<idx><role>,..." — токены отсортированы по cellIndex (детерминированно).
export function encodeHolds(holds: RouteHold[], cols: number, rows: number): string {
  const tokens = holds
    .map((h) => {
      const parsed = parseHoldId(h.holdId);
      if (!parsed) return null;
      const [col, row] = parsed;
      return { idx: cellIndex(col, row, cols), char: ROLE_TO_CHAR[h.role] };
    })
    .filter((t): t is { idx: number; char: string } => t !== null)
    .sort((a, b) => a.idx - b.idx)
    .map((t) => `${t.idx}${t.char}`);
  return `${VERSION}.${cols}x${rows}.${tokens.join(',')}`;
}

export function encodeRoute(route: Route, config: BoardConfig): string {
  return encodeHolds(route.holds, config.cols, config.rows);
}

// Строгий разбор payload; null при любой невалидности (мягкая ошибка на уровне UI).
export function decodeRoute(payload: string): DecodedRoute | null {
  if (typeof payload !== 'string' || payload.length === 0) return null;

  const parts = payload.split('.');
  if (parts.length !== 3) return null;
  const [version, dims, tokenStr] = parts;
  if (version === undefined || dims === undefined || tokenStr === undefined) return null;
  if (!/^v\d+$/.test(version)) return null;

  const dimMatch = /^(\d+)x(\d+)$/.exec(dims);
  if (!dimMatch) return null;
  const cols = Number(dimMatch[1]);
  const rows = Number(dimMatch[2]);
  if (!Number.isInteger(cols) || !Number.isInteger(rows) || cols <= 0 || rows <= 0) return null;

  const holds: RouteHold[] = [];
  if (tokenStr.length > 0) {
    for (const tok of tokenStr.split(',')) {
      const m = /^(\d+)([SHFT])$/.exec(tok);
      if (!m) return null;
      const idx = Number(m[1]);
      const char = m[2];
      if (!Number.isInteger(idx) || idx < 0 || idx >= cols * rows || char === undefined) {
        return null;
      }
      const role = CHAR_TO_ROLE[char];
      if (!role) return null;
      holds.push({ holdId: holdId(idx % cols, Math.floor(idx / cols)), role });
    }
  }

  return { version, cols, rows, holds };
}
