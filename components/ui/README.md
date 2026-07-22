# Rondivo Design System (`components/ui`)

Primitives réutilisables qui reproduisent **l'identité actuelle** de Rondivo à
partir des tokens existants. Elles ne changent ni le design ni les
fonctionnalités : elles nomment et centralisent ce que les écrans font déjà, pour
que le prochain écran soit plus rapide à écrire et impossible à rendre
incohérent.

- **Comment structurer un écran / une feature** → [`ARCHITECTURE_RULES.md`](../../ARCHITECTURE_RULES.md)
- **Quand créer une primitive / variante / composant métier** → [`COMPONENT_GUIDELINES.md`](../../COMPONENT_GUIDELINES.md)

```tsx
import { AppScreen, AppSection, AppCard, CardHeader, CardContent, AppText, AppButton } from '@/components/ui';
```

---

## Pourquoi ce système existe (problèmes résolus)

Cette couche a été ajoutée après un audit du projet. Les problèmes concrets
qu'elle adresse :

1. **Animation de press dupliquée ~10×** (`Animated.Value(1)` + `onPressIn/out`),
   avec des valeurs de scale légèrement différentes à chaque fois (0.98, 0.978,
   0.95, 0.92, 0.9, 0.86…). → `usePressScale` / `PressableScale` + `PressScale` tokens.
2. **Deux implémentations de shimmer** (home `SkeletonBlock`, planning `Shimmer`).
   → `useShimmer` / `AppSkeleton`.
3. **Animation d'entrée dupliquée** (planning cards, empty state, travel).
   → `useEntrance`.
4. **Conteneurs « card » recopiés** (`backgroundColor + Radius.card + cardShadow`)
   dans 5+ endroits. → `AppSurface` / `AppCard`.
5. **Tuiles icône douces recopiées** (quick-actions, reminders, rappels).
   → `AppIconTile`.
6. **Pills / badges recopiés** (status pill, header badge, EN COURS / URGENT).
   → `AppBadge` / `AppStatus`.
7. **Boutons ronds recopiés** (bell, settings, back, +, GPS, nav). → `AppIconButton`.
8. **États vides / erreur recopiés** (planning EmptyState/ErrorState, home, reminders).
   → `AppEmptyState`.
9. **Titres de section recopiés** (home, rappels). → `AppSection`.
10. **Rows recopiées** (rappels ActionRow, reminders). → `AppListItem`.
11. **Squelette d'écran recopié** (`root/safeArea/ScrollView/BottomNav`). → `AppScreen`.
12. **Couleur de statut décidée dans 3 fichiers** (planning : `TIME_COLOR`,
    `DOT_COLOR`, `STATUS_STYLE`). → `StatusAccent` / `Accent`.
13. **Valeurs codées en dur malgré les tokens** : polices (17, 19, 30…), graisses
    ('700'…), letter-spacing, couleurs (`#ECEEF2`, `#E4E8EF`, `#1A50E2`…).
    → `Typography`, `FontWeight`, `LetterSpacing`, `Accent`, `<AppText variant>`.

Rien de tout cela n'a été réécrit de force dans les écrans existants : la
migration est **progressive** (voir COMPONENT_GUIDELINES §9).

---

## Catalogue

### Foundations

- **`AppText`** — le seul `Text` à utiliser. `variant` (ramp typo) + `color`
  sémantique. Plus aucun `fontSize/fontWeight` épars.
- **`PressableScale`** — Pressable animé (scale + haptique). Base de tous les
  éléments interactifs.

### Surfaces & layout

- **`AppSurface`** — boîte de base : fond + rayon + élévation optionnelle.
- **`AppCard`** + **`CardHeader` / `CardContent` / `CardFooter` / `CardActions`** —
  la card standard et ses slots. `onPress` la rend pressable.
- **`AppSection`** — bloc d'écran titré (titre + sous-titre + action + rythme).
- **`AppScreen`** — squelette d'écran (fond, safe-area, scroll, footer).
- **`AppHeader`** — en-tête d'écran (leading + titre/eyebrow + trailing).
- **`AppToolbar`** — barre horizontale de contrôles.
- **`AppDivider`** — séparateur hairline (horizontal/vertical, inset).

### Controls

- **`AppButton`** — bouton unique. `variant` (primary/secondary/ghost/danger),
  `size`, `icon`, `trailingIcon`, `loading`, `fullWidth`.
- **`AppIconButton`** — bouton icône seul. `variant`, `size`, `shape`, `badgeCount`.
- **`AppChip`** — pill sélectionnable (filtres/tags).

### Content

- **`AppIconTile`** — tuile icône douce (accent = fond + tint).
- **`AppBadge`** — étiquette de statut figée.
- **`AppStatus`** — statut sémantique (dot + label via `StatusAccent`).
- **`AppAvatar`** — avatar image (expo-image) ou initiales.
- **`AppMetric`** — figure labellisée (label + valeur + hint), `onColor` pour le hero.
- **`AppListItem`** — row [tuile] titre/sous-titre [chevron].

### Feedback & states

- **`AppEmptyState`** — vide **et** erreur (`tone="neutral"`), CTA optionnel.
- **`AppSkeleton`** — bloc de chargement shimmer.

### Forms

- **`AppInput`** — champ texte (focus ring, invalid, icône, trailing).
- **`AppFormField`** — label + hint + erreur autour d'un contrôle.
- **`AppSelect`** — sélection d'une valeur via `AppBottomSheet`.

### Overlays

- **`AppModal`** — dialogue centré (RN Modal, sans dépendance).
- **`AppBottomSheet`** — feuille du bas (RN Modal + Animated, safe-area).

---

## Tokens consommés

| Fichier               | Contenu |
| --------------------- | ------- |
| `constants/design.ts` | `Palette`, `Spacing`, `Radius`, `FontSize` **+** `FontWeight`, `LetterSpacing`, `Opacity`, `BorderWidth`, `HitSlop`, `IconSize`, `ControlSize`, `Accent`, `StatusAccent`, `Typography` |
| `constants/shadow.ts` | `heroShadow`, `cardShadow`, `actionShadow`, `badgeShadow`, `iconButtonShadow` |
| `constants/motion.ts` | `Spring`, `PressScale`, `Duration`, `StaggerDelay`, `ShimmerColors` |

Tous les tokens étendus sont **additifs** : aucune valeur existante n'a été
modifiée, donc aucun écran ne peut bouger visuellement.

---

## Règles rapides

- Import depuis `@/components/ui` (barrel), pas les fichiers individuels.
- Une couleur/rayon/ombre/graisse codés en dur = un bug de style. Utilise un token.
- Besoin d'un nouveau cas ? Ajoute une **variante** à une primitive avant de créer
  un composant. Voir COMPONENT_GUIDELINES.
- Les primitives ne contiennent **jamais** de logique métier ni d'accès Supabase.
```
