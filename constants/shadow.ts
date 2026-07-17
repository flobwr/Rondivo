import { Platform } from 'react-native';

import { Palette } from './design';

// Unified shadow philosophy — Apple style.
// All shadows share the same DNA: vertical-only offset, very high blur radius
// relative to offset (radius ≥ 3× offset), very low opacity, no harsh edge.
// Only the weight differs across levels. Radius runs wide and opacity low so
// every shadow reads as a soft, diffuse lift rather than a cast shadow.

// Hero card — dominant, but still tasteful. Now that cards carry a hairline
// border, the shadow's job is only "float", never "edge" — so it runs wide,
// warm and faint.
export const heroShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.07,
    shadowRadius: 28,
  },
  android: { elevation: 5 },
  default: { boxShadow: '0px 10px 28px rgba(38, 34, 26, 0.07)' },
});

// White cards (reminders, appointment) — secondary emphasis
export const cardShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
  },
  android: { elevation: 2 },
  default: { boxShadow: '0px 5px 16px rgba(38, 34, 26, 0.05)' },
});

// Quick action cards — barely-there, very diffuse
export const actionShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.025,
    shadowRadius: 13,
  },
  android: { elevation: 1 },
  default: { boxShadow: '0px 2px 13px rgba(38, 34, 26, 0.025)' },
});

// "5 interventions" badge — near-invisible lift
export const badgeShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.025,
    shadowRadius: 5,
  },
  android: { elevation: 0 },
  default: { boxShadow: '0px 1px 5px rgba(38, 34, 26, 0.025)' },
});

// Notification / settings buttons — extremely subtle
export const iconButtonShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.035,
    shadowRadius: 5,
  },
  android: { elevation: 0 },
  default: { boxShadow: '0px 1px 5px rgba(38, 34, 26, 0.035)' },
});

// Floating circular action button over a busy/gradient surface (Home hero's
// GPS button) — needs more presence than a plain icon button, but still
// follows the same DNA as every other shadow above.
export const floatingButtonShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
  },
  android: { elevation: 4 },
  default: { boxShadow: '0px 4px 14px rgba(38, 34, 26, 0.12)' },
});
