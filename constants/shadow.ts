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

// Bottom navigation — the only shadow that points *upwards*, because it is the
// only surface the content passes underneath. Deliberately weaker than a card
// shadow: the fade gradient above the bar does most of the depth work, this
// just stops the bar from sitting flat on the page.
export const navShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
  },
  android: { elevation: 8 },
  default: { boxShadow: '0px -2px 14px rgba(15, 23, 41, 0.05)' },
});

// Focal (in-progress) planning card — a slightly stronger, brand-tinted lift so
// the eye lands on the current intervention first. The only shadow that is
// blue-tinted rather than the neutral app shadow.
export const focalShadow = Platform.select({
  ios: {
    shadowColor: Palette.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
  },
  android: { elevation: 5 },
  default: { boxShadow: '0px 6px 18px rgba(37, 99, 235, 0.16)' },
});
