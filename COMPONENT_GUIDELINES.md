# Rondivo — Component Guidelines

> Les conventions de **création des composants UI** : quand créer une primitive,
> quand créer une variante, quand créer un composant métier — avec des exemples.
>
> Les règles d'architecture générales (features, services, hooks, styling) sont
> dans **[ARCHITECTURE_RULES.md](./ARCHITECTURE_RULES.md)**. Ce document se
> concentre uniquement sur les composants.

---

## 1. La décision fondamentale : primitive, variante ou composant métier ?

Avant d'écrire un composant, réponds dans cet ordre :

```
1. Est-ce que ça existe déjà dans components/ui ?         → utilise-le
2. Une PROP/VARIANTE d'une primitive suffirait-elle ?      → ajoute la variante
3. Est-ce visuel & réutilisable partout, sans métier ?     → nouvelle PRIMITIVE (components/ui)
4. Est-ce spécifique à un domaine (client, devis…) ?       → COMPOSANT MÉTIER (features/<domaine>)
```

### Définitions

- **Primitive** (`components/ui`, préfixe `App*`) : brique visuelle générique,
  **sans logique métier**, pilotée uniquement par des tokens et des props.
  Ex : `AppButton`, `AppCard`, `AppListItem`.
- **Variante** : un cas d'une primitive exprimé par une prop (`variant`, `size`,
  `accent`, `tone`, `selected`…). **Pas** un nouveau composant.
- **Composant métier** (`features/<domaine>/components`) : compose des primitives
  pour un usage précis. Il connaît un type du domaine.
  Ex : `AppointmentCard`, `ClientRow`, `QuoteSummaryCard`.

---

## 2. Ne JAMAIS forker un bouton (ni une card, un badge, un input…)

❌ **Interdit :**

```tsx
function QuoteButton() { … }
function InvoiceButton() { … }
function ReminderButton() { … }
```

✅ **À la place :**

```tsx
<AppButton label="Nouveau devis"   icon="file-plus"   variant="primary" />
<AppButton label="Envoyer facture" icon="send"        variant="secondary" />
<AppButton label="Rappel"          icon="bell"        variant="ghost" />
```

La même logique s'applique à **Card, Badge, Input, Avatar, Chip, IconButton**.
Si un besoin n'entre pas dans les variantes existantes → on **étend la primitive**
avec une nouvelle variante partagée, on ne crée pas un composant parallèle.

---

## 3. Quand créer une nouvelle variante (vs une nouvelle primitive)

Crée une **variante** quand :

- la structure et le comportement sont identiques, seule l'apparence change
  (couleur, taille, emphase) ;
- ça reste exprimable par une prop d'énumération courte.

Crée une **nouvelle primitive** quand :

- la structure/layout est fondamentalement différente ;
- elle sera réutilisée par **plusieurs** écrans/domaines ;
- elle ne porte aucune connaissance métier.

> Règle du **rule of three** : au 3ᵉ endroit où tu recopies le même bloc visuel,
> extrais une primitive. Avant 3, une variante ou une simple composition suffit
> souvent.

---

## 4. Quand NE PAS créer de composant

- Si `<AppCard>` + slots suffit → n'emballe pas dans un nouveau composant « pour
  ranger ».
- Si c'est utilisé **une seule fois** et trivial → laisse-le inline dans l'écran.
- Si tu hésites entre « variante » et « nouveau composant » et que le nouveau
  composant ne servirait qu'à cacher une couleur codée en dur → c'est une
  variante.

---

## 5. Composition plutôt que composants géants

Préfère toujours :

```tsx
<AppCard>
  <CardHeader>
    <AppText variant="overline" color="secondary">RAPPELS</AppText>
    <AppButton label="Voir tout" variant="ghost" size="sm" trailingIcon="chevron-right" />
  </CardHeader>
  <CardContent>
    <AppText variant="callout">Créer la facture de M. Dupont.</AppText>
  </CardContent>
  <CardFooter>
    <AppMetric label="ÉCHÉANCE" value="30 juin" />
  </CardFooter>
</AppCard>
```

… à un composant `HugeBusinessCard` de 300 lignes qui gère tout en interne.
Un composant métier orchestre la **composition** ; il ne réimplémente pas les
briques.

---

## 6. Règles d'API des composants

- **Props sémantiques**, pas de style brut exposé : `variant`, `accent`, `size`,
  `tone` — pas `backgroundColor`, `paddingHorizontal` en props publiques.
- **Un `accent` = une famille de couleurs** (`Accent[name] = { solid, soft }`).
  Un « chip bleu » et une « tuile bleue » partagent donc exactement les 2 mêmes
  couleurs.
- **Accessibilité** : `accessibilityRole`, `accessibilityLabel` (obligatoire sur
  les boutons icône), `accessibilityState` pour selected/disabled/busy.
- **`children` + slots** pour la flexibilité ; props pour les cas cadrés.
- **Pas de `console.log`**, pas d'effets de bord dans le rendu.

---

## 7. Styling dans un composant

- Toujours via tokens (voir ARCHITECTURE_RULES §8).
- Texte via `<AppText variant=… color=… />` — évite les `StyleSheet` de police.
- Ombres via les tokens `constants/shadow.ts`.
- Press/entrance/shimmer via `PressableScale` / `usePressScale` / `useEntrance` /
  `useShimmer`.

---

## 8. Catalogue des primitives (quand utiliser quoi)

| Primitive        | Utiliser pour…                                              | Ne pas utiliser pour |
| ---------------- | ----------------------------------------------------------- | -------------------- |
| `AppSurface`     | un panneau neutre (fond + rayon + ombre optionnelle)        | du texte seul |
| `AppCard`        | une **unité de contenu** (rdv, rappel, métrique)            | un simple fond de section |
| `CardHeader/Content/Footer/Actions` | structurer l'intérieur d'une card            | remplacer une section d'écran |
| `AppSection`     | un **bloc d'écran titré** + rythme vertical                 | grouper l'intérieur d'une card |
| `AppScreen`      | le squelette d'un écran (safe-area, scroll, footer)         | un sous-composant |
| `AppHeader`      | l'en-tête d'écran (retour/avatar + titre + actions)         | un titre de section |
| `AppToolbar`     | une barre horizontale de contrôles (chips, actions)         | contenu vertical |
| `AppButton`      | **toute** action textuelle                                  | une icône seule → `AppIconButton` |
| `AppIconButton`  | action icône seule (retour, bell, +, GPS…)                  | action avec label |
| `AppChip`        | filtre/tag **sélectionnable**                               | un statut figé → `AppBadge` |
| `AppBadge`       | **étiquette de statut** figée (soft + accent)               | une action |
| `AppStatus`      | statut **sémantique** (dot + label via `StatusAccent`)      | un badge décoratif libre |
| `AppIconTile`    | la tuile icône douce en tête de row/action                  | un bouton |
| `AppAvatar`      | avatar utilisateur/client (image ou initiales)              | une icône générique |
| `AppMetric`      | une figure **labellisée** (label + valeur + hint)           | un paragraphe |
| `AppListItem`    | une **row** [tuile] titre/sous-titre [chevron]              | une card riche |
| `AppEmptyState`  | vide **et** erreur (`tone="neutral"` pour l'erreur)         | un simple message inline |
| `AppSkeleton`    | placeholders de chargement                                  | un vrai contenu |
| `AppInput`       | champ texte                                                 | une sélection → `AppSelect` |
| `AppFormField`   | envelopper un contrôle (label + hint + erreur)              | de la mise en page libre |
| `AppSelect`      | choisir **une** valeur (ouvre une bottom sheet)             | saisie libre |
| `AppModal`       | dialogue **centré** (confirmations)                         | listes/formulaires longs |
| `AppBottomSheet` | feuille **du bas** (pickers, formulaires courts)            | une alerte brève |
| `AppText`        | **tout** texte (variant + color)                            | jamais de `<Text>` nu en écran |

---

## 9. Migration des composants existants (progressive, non bloquante)

Les composants actuels (`components/home/*`, `components/planning/*`) **restent
fonctionnels** et ne changent pas d'apparence. On les migre **opportunistement** :

1. Quand tu touches un composant, remplace ses blocs recopiés par des primitives
   **sans changer le rendu** (même couleurs, mêmes espacements — ce sont les
   mêmes tokens).
2. Exemple de cibles évidentes :
   - `home/reminders-card` & `rappels` ActionRow → `AppCard` + `AppListItem`.
   - press animations locales → `usePressScale` / `PressableScale`.
   - shimmer (home + planning) → `AppSkeleton`.
   - status pills / badges → `AppBadge` ; maps de couleur de statut →
     `StatusAccent` / `AppStatus`.
3. Un PR de migration ne mélange pas « refactor » et « nouvelle feature ».

> Aucune migration n'est obligatoire d'un coup. La règle : **le code nouveau
> utilise les primitives ; le code ancien migre quand on le touche.**

---

## 10. Exemple complet : une row métier

```tsx
// features/reminders/components/reminder-row.tsx
import { AppListItem } from '@/components/ui';
import type { Reminder } from '../types';

export function ReminderRow({ reminder, onOpen }: { reminder: Reminder; onOpen: () => void }) {
  return (
    <AppListItem
      icon={reminder.icon}
      accent={reminder.accent}      // 'blue' | 'orange' | 'purple' | 'green'
      title={reminder.title}
      subtitle={reminder.subtitle}
      onPress={onOpen}
    />
  );
}
```

Zéro couleur codée en dur, zéro ombre recopiée, zéro animation dupliquée — et
visuellement identique aux rows actuelles.
```
