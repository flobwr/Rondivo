---
target: Interventions & Photos (app/intervention/[id].tsx)
total_score: 17
p0_count: 3
p1_count: 3
timestamp: 2026-07-07T13-12-00Z
slug: app-intervention-id-tsx
---
Method: dual-agent (A: a1455cfc7f0810507 · B: a94975a34fa36dbe4). Browser evidence unavailable — fallback to deterministic scan + manual audit.

## Nielsen Heuristics: 17/40 (Poor) — weakest flow of the app
Deterministic scan: 0 findings.

## Priority Issues
- [Critique] Main CTAs on the intervention screen ("Commencer l'intervention", "Compléter le rapport", "Modifier") are all wired to no-ops (`() => {}`) — haptic + animation fire, nothing happens.
- [Critique] Two parallel, disconnected photo systems (components/intervention/* vs components/documents/photos/*) with disjoint mock IDs — photos taken during an intervention never appear in the Photos module or in generated reports.
- [Critique] Photos silently disappear on screen refocus: local `useState` reset from `getIntervention()`, which returns a fresh object (not persisted) for any non-hardcoded id, combined with `useFocusEffect` refetch on every focus. No real upload/persistence mechanism exists at all (confirmed via repo-wide grep for upload/fetch/progress/retry).
- [Élevé] Photo deletion (PhotoLightbox) has no confirmation, on a 46×46px target with no hitSlop.
- [Élevé] Gallery permission refusal is completely silent (no Alert), unlike the camera path.
- [Élevé] Photos section is the 5th block on the intervention screen (after QuickActions/Address/Description/Equipment) — buried below the fold for the single most time-critical action on a job site.

## Personas
Artisan "photo + note in 10s": must scroll past 4 sections to reach Photos; can't actually "note" anything since the report CTA is dead; can't delete a mis-taken photo from this screen. Riley: 50-photo gallery uses a non-virtualized ScrollView (vs. photos.tsx's proper FlatList) — perf risk; permission failure reads as "app broken".
