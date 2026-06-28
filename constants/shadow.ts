import { Platform } from 'react-native';

import { Palette } from './design';

// Shadow hierarchy — Apple style: very blurred, soft, layered.
// Never use the same shadow everywhere — each level has a distinct weight.

// Hero card — dominant shadow, most visible element on screen
export const heroShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
  },
  android: { elevation: 10 },
  default: { boxShadow: '0px 14px 28px rgba(15, 23, 41, 0.14)' },
});

// White cards (reminders, appointment) — important but secondary
export const cardShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  android: { elevation: 4 },
  default: { boxShadow: '0px 8px 20px rgba(15, 23, 41, 0.08)' },
});

// Quick action cards — very light, barely-there
export const actionShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  android: { elevation: 1 },
  default: { boxShadow: '0px 2px 8px rgba(15, 23, 41, 0.04)' },
});

// "5 interventions" badge — near-invisible, just lifts it off the surface
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

// Notification / settings icon buttons — extremely subtle depth
export const iconButtonShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  android: { elevation: 0 },
  default: { boxShadow: '0px 1px 4px rgba(15, 23, 41, 0.05)' },
});
