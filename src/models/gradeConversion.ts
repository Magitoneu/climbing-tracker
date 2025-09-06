export type GradeSystem = 'V' | 'Font';
import { V_GRADES, FONT_GRADES } from './grades';

// Conversion maps based on provided table
export const vToFont: Record<string, string> = {
  VB: '3–4',
  V0: '4–4+',
  V1: '5–5+',
  V2: '5+–6A',
  V3: '6A–6A+',
  V4: '6B–6B+',
  V5: '6C–6C+',
  V6: '7A',
  V7: '7A+',
  V8: '7B',
  V9: '7B+',
  V10: '7C',
  V11: '7C+',
  V12: '8A',
  V13: '8A+',
  V14: '8B',
  V15: '8B+',
  V16: '8C',
  V17: '9A',
};

export const fontToV: Record<string, string> = {
  '3': 'VB', '4': 'VB', '4+': 'V0', '5': 'V1', '5+': 'V2', '6A': 'V2', '6A+': 'V3', '6B': 'V4', '6B+': 'V4', '6C': 'V5', '6C+': 'V5', '7A': 'V6', '7A+': 'V7', '7B': 'V8', '7B+': 'V9', '7C': 'V10', '7C+': 'V11', '8A': 'V12', '8A+': 'V13', '8B': 'V14', '8B+': 'V15', '8C': 'V16', '9A': 'V17'
};

export function convertGrade(grade: string, toSystem: GradeSystem): string {
  if (toSystem === 'Font') {
    return vToFont[grade] || grade;
  } else {
    return fontToV[grade] || grade;
  }
}
