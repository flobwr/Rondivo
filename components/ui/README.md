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

Cette couche a été ajoutée après un audit du projet. État des problèmes
identifiés (✅ = résolu dans le code existant, ◻︎ = primitive prête, migration
structurelle progressive) :

1. ✅ **Animation de press dupliquée ~10×** (`Animated.Value(1)` + `onPressIn/out`),
   valeurs de scale différentes à chaque fois (0.98, 0.978, 0.95, 0.92, 0.9…).
   → **migrée** vers `usePressScale` dans les 9 composants concernés.
2. ✅ **Deux implémentations de shimmer** (home `SkeletonBlock`, planning `Shimmer`).
   → **migrées** vers `useShimmer` (couleurs/durées exactes préservées).
3. ✅ **Animation d'entrée dupliquée** (planning cards, empty state, travel).
   → **migrée** vers `useEntrance`.
4. ✅ **Couleur de statut / valeurs codées** : toutes les couleurs codées en dur
   (`#ECEEF2`, `#E4E8EF`, `#1A50E2`, gradients, overlays, shimmer, ombre GPS…)
   sont **tokenisées** (`ControlColor`, `BrandColor`, `Gradient`, `Overlay`,
   `ShimmerColors`). ESLint interdit désormais toute couleur codée (`error`).
5. ✅ **Ombre inline** (`focalShadow` du planning) → déplacée dans
   `constants/shadow.ts`.
6. ✅ **Dead code Expo template** (ThemedText/View, HapticTab, IconSymbol,
   use-theme-color, use-color-scheme, theme.ts) → **supprimé** (0 référence).
7. ✅ **États vides / erreur dupliqués** (planning `EmptyState` + `ErrorState`,
   ~190 lignes quasi identiques) → **supprimés**, remplacés par `AppEmptyState`
   (`tone="neutral"` pour l'erreur).
8. ✅ **Deux pills de statut divergentes** (« Confirmé » sur Home, « EN COURS » /
   « URGENT » sur Planning) → **une seule** `AppBadge`, géométrie figée par
   `BadgeSize` (hauteur, padding, taille de texte, taille d'icône).
9. ✅ **Statut décidé dans 3 fichiers du planning** (`STATUS_STYLE`, `TIME_COLOR`,
   `DOT_COLOR`) → `components/planning/status.ts`, dérivé de `StatusAccent`.
10. ◻︎ **Conteneurs « card » / rows / sections** recopiés → primitives prêtes
    (`AppCard`, `AppListItem`, `AppSection`, `AppScreen`). Migration
    **structurelle** progressive : le code nouveau les utilise, l'ancien migre
    quand on le touche (COMPONENT_GUIDELINES §9).

Les migrations « invisibles » (animations, couleurs, dead code) ont été faites
sans **aucun** changement de rendu. Les migrations structurelles restantes
suivent la règle progressive : le code nouveau utilise les primitives, l'ancien
migre quand on le touche, avec QA visuel.

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
- **`AppBadge`** — **la** pill de statut de l'app. Géométrie figée par
  `BadgeSize` : deux tailles, hauteur fixe, jamais de padding ad hoc.
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
| `constants/design.ts` | `Palette`, `Spacing`, `Radius`, `FontSize` **+** `FontWeight`, `LetterSpacing`, `Opacity`, `BorderWidth`, `HitSlop`, `IconSize`, `ControlSize`, `BadgeSize`, `Accent`, `StatusAccent`, `Typography`, `ControlColor`, `BrandColor`, `Gradient`, `Overlay` |
| `constants/shadow.ts` | `heroShadow`, `cardShadow`, `actionShadow`, `badgeShadow`, `iconButtonShadow`, `navShadow`, `focalShadow` |
| `constants/motion.ts` | `Curve`, `Duration`, `Timing`, `Spring`, `PressScale`, `StaggerDelay`, `EntranceTravel`, `EntranceScale`, `ShimmerColors` |

---

## Règles rapides

- Import depuis `@/components/ui` (barrel), pas les fichiers individuels.
- Une couleur/rayon/ombre/graisse codés en dur = un bug de style. Utilise un token.
- Besoin d'un nouveau cas ? Ajoute une **variante** à une primitive avant de créer
  un composant. Voir COMPONENT_GUIDELINES.
- Les primitives ne contiennent **jamais** de logique métier ni d'accès Supabase.
```
