export const colors = {
  bgPrimary: '#FAFAF8',
  bgSecondary: '#F5F4F0',
  bgTertiary: '#ECEAE4',
  bgElevated: '#FFFFFF',

  primary: '#5D8A72',
  primaryHover: '#4A7360',
  primaryLight: '#E8F0EB',
  primaryMuted: '#A8C5B5',

  secondary: '#B8A99A',
  secondaryLight: '#F0EBE6',

  textPrimary: '#2C2C2C',
  textSecondary: '#5C5C5C',
  textMuted: '#8C8C8C',
  textInverse: '#FFFFFF',

  alertRed: '#D9534F',
  alertRedLight: '#FAEDEC',
  alertRedMuted: '#E8A9A7',

  alertYellow: '#D4A03C',
  alertYellowLight: '#FDF6E8',
  alertYellowMuted: '#E8D4A8',

  success: '#5D8A72',
  successLight: '#E8F0EB',

  border: '#E5E3DD',
  borderLight: '#F0EEE9',
} as const;

export type ColorKey = keyof typeof colors;
