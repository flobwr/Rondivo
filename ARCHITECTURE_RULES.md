# Rondivo — Architecture Rules

> Le document de référence technique de Rondivo.
> Objectif : garder le projet **maintenable pendant des années** — chaque nouvel
> écran plus rapide à écrire, chaque composant cohérent avec les autres, et une
> dette technique qui augmente le moins possible.

Ce document décrit **comment on construit** dans Rondivo. Les règles précises de
_conception des composants UI_ (quand créer une primitive vs une variante vs un
composant métier) sont dans **[COMPONENT_GUIDELINES.md](./COMPONENT_GUIDELINES.md)**.

Stack : Expo (SDK 54) · Expo Router · React Native 0.81 · React 19 (React
Compiler activé) · TypeScript strict · Reanimated · Expo Image · Supabase.

---

## 0. Principes directeurs

1. **Les tokens sont la seule source de vérité visuelle.** Aucune couleur,
   rayon, ombre, espacement ou graisse de police codés en dur sans justification.
2. **Composer, pas dupliquer.** Un écran est un assemblage de primitives, pas une
   grande `StyleSheet` recopiée.
3. **Une responsabilité par fichier.** Un hook fait une chose. Un service porte la
   logique métier. Un composant affiche.
4. **La cohérence prime sur la créativité locale.** S'il existe déjà une façon de
   faire, on la réutilise. On ne réinvente pas un bouton par écran.
5. **Incrémental et non destructif.** On prépare le terrain sans casser
   l'existant. On migre écran par écran, jamais en big-bang.

---

## 1. Structure du projet

### 1.1 Aujourd'hui

```
app/                      # routes Expo Router (index, planning, rappels, _layout)
components/
  ui/                     # ★ DESIGN SYSTEM — primitives (App*, Card*)
  navigation/             # chrome de navigation partagé (BottomNav)
  home/                   # composants de l'écran d'accueil
  planning/               # composants de l'écran planning
constants/
  design.ts               # tokens : Palette, Spacing, Radius, FontSize + tokens étendus
  shadow.ts               # tokens d'ombre (hero/card/action/badge/iconButton/focal)
  motion.ts               # tokens d'animation (spring, durées, press scale, shimmer)
hooks/                    # hooks transverses (animation : press/entrance/shimmer)
```

### 1.2 Cible (évolution progressive vers une architecture par domaine)

Le but n'est **pas** de tout déplacer maintenant. Le but est que, quand un
domaine grossit (clients, devis, factures, planning…), il ait un endroit
naturel où vivre :

```
app/                      # routes fines : elles orchestrent, elles ne portent pas la logique
features/
  <domaine>/              # ex: clients, quotes, invoices, planning, reminders
    components/           # composants spécifiques au domaine
    hooks/                # hooks du domaine (use-clients, use-quote-form…)
    services/             # accès données + logique métier (Supabase, calculs)
    types.ts              # types du domaine
    index.ts              # API publique de la feature
components/ui/            # design system partagé (jamais de logique métier)
lib/                      # utilitaires transverses (supabase client, formatters, dates)
constants/                # tokens
hooks/                    # hooks vraiment transverses uniquement
```

**Règle de dépendance (importante pour la scalabilité) :**

```
app  →  features  →  components/ui  →  constants
         │                    ↑
         └────────→ lib ──────┘
```

- `components/ui` ne dépend **jamais** d'une feature ni de Supabase.
- Une feature ne dépend **jamais** d'une autre feature directement ; si besoin,
  on passe par des types partagés ou `lib/`.
- `app/` (les écrans-routes) reste **mince** : il assemble des composants et
  appelle des hooks de feature.

> Cette direction permet de dépasser **150 écrans** et plusieurs années de
> données sans « tout restructurer » : chaque domaine est isolé et remplaçable.

---

## 2. Comment créer un écran

1. Crée le fichier de route dans `app/` (Expo Router, `typedRoutes` activé).
2. Utilise **`AppScreen`** pour le squelette (fond, safe-area, scroll, footer) —
   ne recopie plus `root / safeArea / ScrollView / BottomNav`.
3. Structure le contenu avec **`AppSection`** (titres + rythme vertical) et
   **`AppHeader`** pour l'en-tête.
4. Les données viennent d'un **hook de feature** (`useClients()`,
   `usePlanningDay(date)`…), pas de données mockées inline dans l'écran à terme.
5. Les états `loading / error / empty` utilisent **`AppSkeleton`** et
   **`AppEmptyState`** — pas de nouveau composant d'état par écran.

La **BottomNav flotte au-dessus du contenu** : le scroll passe derrière elle.
Tout conteneur scrollable doit donc réserver sa place via `useBottomNavSpace()`
(`components/navigation/bottom-nav`) — jamais une valeur devinée.

```tsx
export default function ClientsScreen() {
  const { data, status, retry } = useClients();
  const bottomNavSpace = useBottomNavSpace();
  return (
    <AppScreen footer={<BottomNav activeIndex={2} />} contentBottomInset={bottomNavSpace}>
      <AppHeader title="Clients" subtitle="Tous vos clients" />
      {status === 'loading' && <ClientsSkeleton />}
      {status === 'error' && (
        <AppEmptyState icon="wifi-off" tone="neutral" title="Connexion perdue"
          action={{ label: 'Réessayer', onPress: retry }} />
      )}
      {status === 'loaded' && (
        <AppSection title="Récents">
          {data.map((c) => <ClientRow key={c.id} client={c} />)}
        </AppSection>
      )}
    </AppScreen>
  );
}
```

## 3. Comment créer un composant

- **D'abord chercher.** Une primitive existe-t-elle déjà dans `components/ui` ?
  Une variante suffirait-elle ? (voir COMPONENT_GUIDELINES.md).
- Un composant **métier** (`ClientRow`, `QuoteSummaryCard`) vit dans sa feature
  et se **compose** de primitives ; il ne redéfinit ni couleurs ni ombres.
- Pas de logique de données dans un composant d'affichage : il reçoit ses props.
- Découpe : préfère `AppCard > CardHeader/CardContent/CardFooter` à un composant
  monolithique de 300 lignes.

## 4. Comment créer un hook

- **Une responsabilité.** `usePressScale` anime, `useClients` charge des clients.
  Pas de hook « fourre-tout » de 500 lignes.
- Nommage `use-*.ts`, un export par fichier de préférence.
- Les hooks d'accès aux données appellent un **service**, ils ne parlent pas à
  Supabase directement dans le corps du composant.
- Respecte les règles des hooks (React Compiler est activé : pas de mutation de
  ref en cours de render, dépendances honnêtes).

## 5. Comment créer un service

- Un service = la **logique métier + l'accès aux données** d'un domaine.
- Il vit dans `features/<domaine>/services/`.
- Il expose des fonctions typées (`listClients()`, `createQuote(input)`), retourne
  des **types du domaine**, et masque Supabase derrière cette frontière.
- Aucun composant n'importe `@supabase/*` directement — toujours via un service.
- Les erreurs sont normalisées (pas de `throw` brut de Supabase remontant à l'UI).

## 6. Comment créer un provider

- Un provider transverse (auth, thème, réseau) vit haut dans l'arbre
  (`app/_layout.tsx`).
- Il expose un hook d'accès (`useAuth()`), jamais le Context brut.
- Garde les providers **fins** : état + actions. La logique lourde va dans un
  service appelé par le provider.

## 7. Comment créer une feature

1. `features/<domaine>/` avec `components/`, `hooks/`, `services/`, `types.ts`.
2. `index.ts` expose **uniquement** l'API publique (les écrans importent ça).
3. La feature se branche à une route `app/<domaine>/…`.
4. Elle ne connaît pas les internes des autres features.

---

## 8. Styling — règles strictes

**Interdit sans justification écrite (commentaire) :**

| Interdit codé en dur      | À utiliser à la place                                   |
| ------------------------- | ------------------------------------------------------- |
| `padding: 20`             | `Spacing.cardPadding` / `Spacing.lg` …                  |
| `borderRadius: 24`        | `Radius.card` / `Radius.tile` / `Radius.pill`           |
| `color: '#2563EB'`        | `Palette.blue`, `Accent.blue.solid`, `<AppText color>`  |
| `fontWeight: '700'`       | `FontWeight.bold` (ou `<AppText variant>`)              |
| `fontSize: 17`            | `Typography.headline` via `<AppText variant="headline">`|
| `letterSpacing: -0.3`     | `LetterSpacing.snug`                                    |
| `shadowOpacity: …`        | `cardShadow` / `actionShadow` / `heroShadow` …          |
| `elevation: 3`            | idem (les tokens d'ombre gèrent iOS/Android/web)        |

**Pourquoi.** Un token change une fois et se propage partout. Une valeur codée en
dur crée une divergence invisible qui devient de la dette (le planning décide
« urgent = orange » dans trois fichiers différents — c'est exactement ce qu'on
supprime avec `StatusAccent`).

**Où sont les tokens :** `constants/design.ts`
(`Palette`, `Spacing`, `Radius`, `FontSize`, `FontWeight`, `LetterSpacing`,
`Opacity`, `IconSize`, `ControlSize`, `BadgeSize`, `Accent`, `StatusAccent`,
`Typography`, `ControlColor`, `BrandColor`, `Gradient`, `Overlay`),
`constants/shadow.ts` (`…Shadow`, `navShadow`, `focalShadow`),
`constants/motion.ts` (voir § 9).

**Grille d'espacement.** `Spacing.xs…xxxl` (4 · 8 · 12 · 16 · 20 · 24 · 32) est
la seule source. Une valeur hors grille est un bug, pas un choix de design.

**Échelle de rayons.** `Radius.sm / tile / card / hero / pill` (12 · 16 · 24 ·
28 · ∞). Pas de 14 ni de 18 « qui rendait mieux ici ».

**Badges.** Toute pill de statut passe par `AppBadge` : la géométrie vient de
`BadgeSize`, donc deux badges sur deux écrans ont forcément la même hauteur.

**Couleurs — tolérance zéro (ESLint `error`).** Il n'y a plus **aucune** couleur
codée en dur dans `app/`, `components/`, `hooks/`. Toute nouvelle valeur
`#hex` / `rgb()` / `rgba()` hors de `constants/**` fait échouer le lint. Si une
couleur n'a pas encore de token, on l'ajoute dans `constants/` (verbatim si on
veut préserver un rendu exact) puis on la référence.

**Exception légitime :** une valeur purement locale et non réutilisable (ex : la
largeur d'une colonne de time-line, une ombre inline dont le comportement
multi-plateforme doit rester exact comme le bouton GPS du hero) peut rester en
dur **avec un commentaire** expliquant pourquoi. Le nouveau code passe d'abord
par les tokens.

---

## 9. Motion

Rondivo a **une seule identité de mouvement**. Deux mécanismes, deux rôles :

| Mécanisme  | Sert à                                   | Exemples                             |
| ---------- | ---------------------------------------- | ------------------------------------ |
| **Spring** | ce que **le doigt** pilote               | press feedback, bulle du calendrier  |
| **Courbe** | ce que **l'app** décide                  | entrée de card, fade d'écran, sheet  |

Un ressort n'a pas de durée, il a un toucher. Une transition a une durée fixe,
identique partout pour un même **type** d'interaction :

| Type                          | Durée  | Courbe            | Token              |
| ----------------------------- | ------ | ----------------- | ------------------ |
| Micro-interaction             | 180 ms | `Curve.standard`  | `Timing.micro`     |
| Card (entrée, stagger)        | 220 ms | `Curve.enter`     | `Timing.card`      |
| Navigation / contenu d'écran  | 280 ms | `Curve.enter`     | `Timing.navigation`|
| Modal / bottom sheet          | 300 ms | `Curve.enter`     | `Timing.overlay`   |

**Règles :**

- On ne tape jamais une durée ni une courbe à la main :
  `Animated.timing(v, { toValue: 1, useNativeDriver: true, ...Timing.card })`.
- On n'invente pas une 4ᵉ échelle de press : `PressScale.surface / control / icon`.
- On utilise **`usePressScale`**, **`useEntrance`**, **`useFade`**, **`useShimmer`**
  (ou `PressableScale`) au lieu de recopier `Animated.Value` + `onPressIn/out`.
- Pas de rebond appuyé, pas de pulsation, pas d'animation propre à un écran.
  L'utilisateur ne doit pas remarquer l'animation, seulement la fluidité.
- Les constantes vivent dans `constants/motion.ts` (`Curve`, `Duration`,
  `Timing`, `Spring`, `PressScale`, `StaggerDelay`, `EntranceTravel`,
  `EntranceScale`, `ShimmerColors`).

`useShimmer` ne prend **aucune option** : il n'y a qu'une pulsation de
chargement dans l'app.

---

## 10. TypeScript & qualité

- `strict` est activé — pas de `any` non justifié, pas de `@ts-ignore` silencieux.
- Types de domaine partagés : un `Appointment` unique plutôt que deux définitions
  divergentes (aujourd'hui `home` et `planning` ont chacune la leur — à unifier
  dans une feature `planning`/`shared` lors d'une prochaine itération).
- `npx tsc --noEmit` et `npm run lint` doivent rester **verts**.

---

## 11. Ce qu'on ne fait pas

- ❌ Pas de refonte, pas de renommage massif de fichiers, pas de gros refactor
  risqué.
- ❌ Pas de nouvelle librairie de style (NativeWind, Tamagui…) : on a déjà un
  système de tokens qui fonctionne.
- ❌ Pas de logique métier dans les composants d'affichage.
- ❌ Pas de composant `XxxButton` métier quand `AppButton variant` suffit.

---

## 12. Checklist de revue (PR)

- [ ] Aucune couleur / rayon / ombre / graisse codés en dur (ou commentés et
      justifiés).
- [ ] Réutilise les primitives `components/ui` ; pas de duplication d'un pattern
      existant.
- [ ] Le texte passe par `AppText variant` (pas de `fontSize/fontWeight` épars).
- [ ] Un hook = une responsabilité ; la logique data est dans un service/hook,
      pas dans le JSX.
- [ ] `tsc --noEmit` et `lint` verts.
- [ ] Les états loading/error/empty utilisent `AppSkeleton` / `AppEmptyState`.
```
