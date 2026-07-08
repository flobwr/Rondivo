---
target: Documents commerciaux (app/documents.tsx)
total_score: 26
p0_count: 3
p1_count: 3
timestamp: 2026-07-07T13-12-00Z
slug: app-documents-tsx
---
Method: dual-agent (A: a4091bef4beff9771 · B: a1254d4d845e1da27). Browser evidence unavailable — fallback to deterministic scan + manual audit.

## Nielsen Heuristics: 26/40 (Acceptable) — solid UX pattern undermined by broken implementation
Deterministic scan: 0 findings.

## Priority Issues
- [Critique] `app/devis/new.tsx` has a TypeScript syntax error (unclosed parenthesis, line ~279) — the screen does not compile/crashes; also references unimported `SkeletonBlock`.
- [Critique] "Supprimer" on factures/contrats/rapports only does `router.back()` — no actual deletion (`deleteFacture`/`deleteContrat`/`deleteRapport` exist in data layer but are never called). Same pattern for create/update on Factures and Rapports: form shows a success message but nothing is persisted (~9 no-op mutations across 3 modules).
- [Critique] Contrats module has no creation entry point anywhere, and "Modifier" opens a "bientôt disponible" stub — read-only in practice despite being presented as a peer to devis/factures/rapports.
- [Élevé] Contrast failures on status badges: green "Payée/Accepté" badge ≈2.26:1, red "En retard" ≈3.72:1, orange ≈3.12:1 — the exact statuses an artisan needs to spot at a glance.
- [Élevé] Structural inconsistency: only devis uses async loading/error states; factures/contrats/rapports read mocks synchronously with zero loading/error handling.
- [Élevé] No try/catch around PDF generation/share on any of the 4 document types — silent failure.
- [Moyen] No inline validation on create forms (0€ devis can be sent to a client).

## Personas
Riley: confirms deletion of a facture, it's still there after refresh; devis edit/duplicate crashes; contrat "Modifier" is a dead end. Artisan "send a devis in 30s": happy path works well, but editing right before sending crashes the app — worst possible moment.
