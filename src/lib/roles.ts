// Палитра ролей и описание кистей — единый источник для UI и 3D-слоя.
// Цвета — Okabe–Ito (colorblind-safe). Меняются здесь в одном месте.
import type { Brush, HoldRole } from 'src/types/board';

export const ROLE_COLORS: Record<HoldRole | 'off', string> = {
  start: '#009E73', // зелёный
  hand: '#0072B2', // синий
  foot: '#E69F00', // оранжевый
  finish: '#D55E00', // красно-оранжевый
  off: '#BBBBBB', // серый (зацеп не в трассе)
};

export interface BrushDef {
  brush: Brush;
  i18nKey: string; // ключ в i18n (brush.*)
  icon: string; // material icon
  color: string; // цвет свотча для UI
}

export const BRUSHES: BrushDef[] = [
  { brush: 'start', i18nKey: 'brush.start', icon: 'flag', color: ROLE_COLORS.start },
  { brush: 'hand', i18nKey: 'brush.hand', icon: 'pan_tool', color: ROLE_COLORS.hand },
  { brush: 'foot', i18nKey: 'brush.foot', icon: 'directions_walk', color: ROLE_COLORS.foot },
  { brush: 'finish', i18nKey: 'brush.finish', icon: 'sports_score', color: ROLE_COLORS.finish },
  { brush: 'erase', i18nKey: 'brush.erase', icon: 'backspace', color: ROLE_COLORS.off },
];
