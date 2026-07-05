/**
 * Shared animation constants for the Rondivo app.
 *
 * Centralises the timing/spring values that were previously hand-copied
 * across dozens of files, so every "press", "fade in" or "shimmer" feels
 * identical no matter which screen it's on.
 */

// Press feedback (PressableScale) — used app-wide for tappable cards/rows/buttons.
export const PressSpring = {
  in: { friction: 6, tension: 300 },
  out: { friction: 4, tension: 120 },
} as const;

// Screen-level content fade-in after a skeleton/loading state resolves.
export const ScreenFadeInDuration = 280;

// Short fade used when a list's rows first appear or a filter changes them.
export const ListFadeInDuration = 180;

// Per-row stagger delay for FadeInItem-style entrances (capped at 6 rows).
export const StaggerRowDelay = 26;
export const StaggerRowCap = 6;

// Ambient skeleton shimmer loop.
export const ShimmerDuration = 900;
