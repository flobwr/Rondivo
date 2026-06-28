import { Platform } from 'react-native';

import { Palette } from './design';

// Unified shadow philosophy — Apple style.
// All shadows share the same DNA: vertical-only offset, very high blur radius
// relative to offset (radius ≥ 3× offset), very low opacity, no harsh edge.
// Only the weight differs across levels.

// Hero card — dominant, but still tasteful
export const heroShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
  },
  android: { elevation: 8 },
  default: { boxShadow: '0px 10px 24px rgba(15, 23, 41, 0.10)' },
});

// White cards (reminders, appointment) — secondary emphasis
export const cardShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
  },
  android: { elevation: 3 },
  default: { boxShadow: '0px 6px 16px rgba(15, 23, 41, 0.07)' },
});

// Quick action cards — barely-there, very diffuse
export const actionShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  android: { elevation: 1 },
  default: { boxShadow: '0px 2px 10px rgba(15, 23, 41, 0.03)' },
});

// "5 interventions" badge — near-invisible lift
export const badgeShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  android: { elevation: 0 },
  default: { boxShadow: '0px 1px 4px rgba(15, 23, 41, 0.03)' },
});

// Notification / settings buttons — extremely subtle
export const iconButtonShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  android: { elevation: 0 },
  default: { boxShadow: '0px 1px 4px rgba(15, 23, 41, 0.04)' },
});
