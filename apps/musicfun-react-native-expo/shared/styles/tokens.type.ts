import { COLORS, FONTS_SIZES, GAPS, RADIUS } from '@/shared/styles/tokens'

export type ColorTheme = keyof typeof COLORS
export type GapName = keyof typeof GAPS
export type RadiusName = keyof typeof RADIUS
export type FontName = keyof typeof FONTS_SIZES

export type DarkColorKey = keyof (typeof COLORS)['DARK']
export type LightColorKey = keyof (typeof COLORS)['LIGHT']
