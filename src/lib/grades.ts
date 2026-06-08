// Системы категорий и списки значений (см. спеку §12). Конвертер Font↔V — стретч (M6).
import type { GradeSystem } from 'src/types/board';

export const GRADE_SYSTEMS: GradeSystem[] = ['font', 'v', 'french', 'color', 'custom'];

// Списки значений для систем, где они применимы (приблизительные, для MVP).
export const GRADE_VALUES: Partial<Record<GradeSystem, string[]>> = {
  font: [
    '4', '5', '5+', '6A', '6A+', '6B', '6B+', '6C', '6C+',
    '7A', '7A+', '7B', '7B+', '7C', '7C+', '8A', '8A+', '8B', '8B+', '8C',
  ],
  v: ['VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14'],
  french: [
    '4a', '4b', '4c', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+',
    '6c', '6c+', '7a', '7a+', '7b', '7b+', '7c', '7c+', '8a',
  ],
};

// Есть ли у системы предопределённый список значений (иначе — свободный ввод).
export function hasValueList(system: GradeSystem): boolean {
  return system in GRADE_VALUES;
}
