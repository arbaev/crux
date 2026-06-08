// Модель данных Crux (см. спеку §5). Чистые типы, не зависят от Three.js/Vue.

export type HoldRole = 'start' | 'hand' | 'foot' | 'finish';

// Кисть в конструкторе: роль либо «стереть».
export type Brush = HoldRole | 'erase';

// Одна позиция зацепа на доске (фиксированная сетка).
export interface HoldPosition {
  id: string; // стабильный id, напр. `${col}-${row}`
  col: number; // 0..cols-1, слева направо
  row: number; // 0..rows-1, сверху вниз
  // мировые координаты на стене (вычисляются из col/row/spacing)
  x: number;
  y: number;
  z: number;
}

export interface BoardConfig {
  id: string; // идентификатор раскладки доски (на будущее — разные доски)
  cols: number;
  rows: number;
  spacing: number; // расстояние между зацепами в мировых единицах
  angle: number; // наклон стены в градусах (0 = вертикаль); для стретча
}

// Назначение роли конкретному зацепу в трассе (сериализованная форма).
export interface RouteHold {
  holdId: string;
  role: HoldRole;
}

export type GradeSystem = 'font' | 'v' | 'french' | 'color' | 'custom';

export interface Route {
  id: string; // uuid
  name: string;
  grade?: string; // напр. "6B" / "V4"
  gradeSystem?: GradeSystem;
  boardId: string; // на какой раскладке доски собрана
  holds: RouteHold[];
  createdAt: number; // epoch ms
  updatedAt: number;
}
