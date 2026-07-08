---
target: Clients (app/clients.tsx)
total_score: 26
p0_count: 2
p1_count: 4
timestamp: 2026-07-07T13-12-00Z
slug: app-clients-tsx
---
Method: dual-agent (A: a23714661e8777909 · B: a95bea8e4f31aed74). Browser evidence unavailable — fallback to deterministic scan + manual audit.

## Nielsen Heuristics: 26/40 (Acceptable)
Deterministic scan: 0 findings (RN StyleSheet not covered by detector ruleset).

## Priority Issues
- [Critique] Note deletion with no confirmation/undo (`TabSections.tsx:350`), on a 32×32px touch target (`:492-498`).
- [Critique] Contrast: textTertiary (#9AA3AF, ~2.4-2.55:1) used as real info text (field labels, phone numbers) in InformationsCard/ContactsCard.
- [Élevé] Zero `hitSlop` anywhere in detail/create flow (~9 controls <44-48px): DetailHeader back/edit/menu (40×40), close button on new.tsx (40×40), call button (38×38), tab bar (~30px).
- [Élevé] Client detail "Résumé" tab: 6 identically-weighted SectionCards stacked, 6/8 cognitive-load checklist failures — a wall of information.
- [Élevé] Network error on client detail shows misleading "Client introuvable" instead of retry (status==='error' not distinguished).
- [Élevé] Phone/VAT validators exist (`isValidPhoneFor`, `isValidFrenchVat`) but never surfaced to the user — invalid data silently saved.
- [Moyen] QuickActionsBar: 5 icon-only actions, no labels, exceeds 4-choice cognitive limit.
- [Moyen] ~50 magic-number spacing/radius/fontSize values bypass design.ts tokens.

## Personas
Casey: must scan 9 near-identical cards to find one fact; icon-only actions risk mistap. Artisan chantier: ~10 secondary actions on client detail open "bientôt disponible" alerts — undermines trust mid-demo with a client.
