export const gradeColors: Record<string, string> = {
  VB: '#B3E5FC',
  '3–4': '#B3E5FC',
  V0: '#81D4FA',
  '4–4+': '#81D4FA',
  V1: '#4FC3F7',
  '5–5+': '#4FC3F7',
  V2: '#29B6F6',
  '5+–6A': '#29B6F6',
  V3: '#26A69A',
  '6A–6A+': '#26A69A',
  V4: '#009688',
  '6B–6B+': '#009688',
  V5: '#00897B',
  '6C–6C+': '#00897B',
  V6: '#00695C',
  '7A': '#00695C',
  V7: '#5E35B1',
  '7A+': '#5E35B1',
  V8: '#3949AB',
  '7B': '#3949AB',
  V9: '#1E88E5',
  '7B+': '#1E88E5',
  V10: '#43A047',
  '7C': '#43A047',
  V11: '#388E3C',
  '7C+': '#388E3C',
  V12: '#FBC02D',
  '8A': '#FBC02D',
  V13: '#FFA000',
  '8A+': '#FFA000',
  V14: '#F57C00',
  '8B': '#F57C00',
  V15: '#E64A19',
  '8B+': '#E64A19',
  V16: '#8D6E63',
  '8C': '#8D6E63',
  V17: '#6D4C41',
  '9A': '#6D4C41',
};
// src/theme.ts
export const colors = {
  primary: '#46464bff', // vivid purple
  accent: '#FF6F3C', // orange
  background: '#F5F6FA', // off-white
  surface: '#FFFFFF',
  text: '#22223B', // deep blue
  error: '#FF3B30',
  border: '#E5EAF2',
  chipSelected: '#6C63FF',
  chipUnselected: '#FFFFFF',
  chipBorder: '#6C63FF',
  tabInactive: '#A0A3BD',
  flash: '#ffc400ff', // gold/yellow for flash
};

export const buttonStyle = {
  backgroundColor: colors.primary,
  borderRadius: 32,
  paddingVertical: 16,
  paddingHorizontal: 32,
  alignItems: 'center',
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 3,
};

export const buttonText = {
  color: '#fff',
  fontWeight: '700',
  fontSize: 18,
  letterSpacing: 0.5,
};

export const inputStyle = {
  borderWidth: 0,
  borderRadius: 24,
  padding: 16,
  backgroundColor: colors.surface,
  color: colors.text,
  marginBottom: 12,
  fontSize: 16,
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 1,
};

export const chipStyle = {
  borderWidth: 1,
  borderColor: colors.chipBorder,
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 20,
  marginRight: 10,
  backgroundColor: colors.chipUnselected,
  minWidth: 48,
  alignItems: 'center',
  justifyContent: 'center',
};

export const chipSelectedStyle = {
  backgroundColor: colors.chipSelected,
  borderColor: colors.chipSelected,
};
