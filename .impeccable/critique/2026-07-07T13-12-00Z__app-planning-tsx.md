---
target: Planning & RDV (app/planning.tsx)
total_score: 32
p0_count: 2
p1_count: 2
timestamp: 2026-07-07T13-12-00Z
slug: app-planning-tsx
---
Method: dual-agent (A: ab361a273ec7cd37c · B: a2aaefb0de8578e0f). Browser evidence unavailable — fallback to deterministic scan + manual audit.

## Nielsen Heuristics: ~32/40 (Good) — strongest flow of the app
Deterministic scan: 0 findings (RN StyleSheet not covered).

## Priority Issues
- [Critique] Nearly all form selectors (date/heure/durée chips, ~26 slots/day) sit at 34-36px touch height — the most-manipulated control in the app, no hitSlop.
- [Critique] TravelCard GPS/navigate button never wired (`onNavigate` prop expected, never passed by `Timeline.tsx`) — dead affordance on the exact "navigate to next job" action.
- [Élevé] No "now / next appointment" visual marker in the timeline — undermines the core promise "check next RDV in 2 seconds".
- [Élevé] No "today" marker in the horizontal calendar strip after navigating away and back.
- [Moyen] textTertiary (#9AA3AF, ~2.4-2.55:1) used for address/duration text and the orange "trop court" badge (~1.93:1) — worst contrast in the app on the badge.

## Personas
Casey: ~35px chips → frequent mistaps while walking one-handed; closing the form loses data with no confirmation; GPS button is dead. Artisan Rondivo: no "next appointment" signal, no "today" marker, can't launch navigation from the timeline.
