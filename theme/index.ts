/**
 * Rondivo Design System — single entry point.
 *
 * Import every design token from `@/theme`:
 *
 *   import { Palette, Spacing, Radius, Type, Elevation } from '@/theme';
 *
 * Screens never define their own colours, radii, shadows or type ramps.
 */

export {
  AmoledPalette,
  ArcticPalette,
  DarkPalette,
  LightPalette,
  MidnightPalette,
  Palette,
  SlatePalette,
  StatusInk,
  THEME_ORDER,
  THEMES,
  getPalette,
  getStatusInk,
  setActivePalette,
  type PaletteShape,
  type ThemeName,
} from './palette';
export { createThemedStyles } from './themed';
export { FontSize, Numeric, Type } from './typography';
export { Radius, Size, Spacing } from './layout';
export {
  Elevation,
  actionShadow,
  badgeShadow,
  cardShadow,
  floatingButtonShadow,
  getElevation,
  heroShadow,
  iconButtonShadow,
} from './elevation';
export {
  ListFadeInDuration,
  Motion,
  PressSpring,
  ScreenFadeInDuration,
  SettleSpring,
  ShimmerDuration,
  StaggerRowCap,
  StaggerRowDelay,
} from './motion';
