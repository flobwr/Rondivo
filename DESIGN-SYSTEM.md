# Rondivo Design System — « Atelier »

Reconstruit à partir de zéro. L'ancien système (barre d'onglets collée,
gris-bleus froids, boutons par écran, ombres génériques) est supprimé.

**Règle unique : aucun écran ne définit son propre style.**
Un écran compose les tokens de `theme/` et les composants de
`components/ui/`. Un bouton, une ombre ou une couleur redéfinis
localement sont un bug de design system.

---

## 1. Philosophie

- **Papier partout.** L'app vit sur un papier calme et légèrement chaud
  (`screen`, `#F4F3F0`). Les cartes sont des feuilles blanc cassé
  (`card`, `#FDFCFA`) — jamais de blanc pur, sauf pour le chrome
  flottant (`float`) : dock, sheets, FAB. L'élévation se lit d'abord
  par la lumière, ensuite par l'ombre.
- **Une seule encre.** Le Bleu Rondivo (`#2447CF`) est une encre
  d'écriture, pas un pot de peinture : action principale, état actif,
  point d'attention — rien d'autre. Les couleurs de statut restent
  confinées à leurs points et badges.
- **Le contraste vient de la lumière.** Ombres, volumes, espacements et
  typographie hiérarchisent ; la couleur signale.

## 2. Tokens (`theme/`)

| Fichier | Contenu |
|---|---|
| `palette.ts` | Surfaces (screen/card/cardMuted/float/inset/insetDeep), encres de texte (AA ≥ 4.5:1 garanti), Bleu Rondivo + lavis, duotones de statut (`…Soft` + `…Ink` — le texte utilise TOUJOURS l'encre, jamais la couleur vive), chrome (`dock` : la capsule de navigation, un ton sous le papier). Palette sombre « papier de nuit » aux mêmes relations. |
| `typography.ts` | SF Pro (police système), presets complets `Type.*` (largeTitle 30 → caption 12), chiffres tabulaires obligatoires (`Numeric`) pour heures, durées, km, montants. |
| `layout.ts` | Grille 4 pt. Gouttière écran 20, rythme de section 28, padding de carte 18. Rayons : hero 26, card 20, tile 14, control 12, pill. Métriques de contrôle (`Size`) : cible 48, bouton 52, puits d'icône 38, dock 64. |
| `elevation.ts` | Ombres à deux couches (contact serré + ambiante large) via `boxShadow`, encre chaude `#141210` à opacités faibles. Quatre niveaux : whisper / card / raised / float. En sombre, le chrome flottant s'appuie sur sa surface plus claire. |
| `motion.ts` | Quatre durées (120/180/240/320), une courbe de décélération maison, deux springs (`PressSpring`, `SettleSpring`). Rien ne rebondit, rien ne boucle pour le spectacle. `useReducedMotion` honoré partout. |

## 3. Composants (`components/ui/`)

Import unique : `import { … } from '@/components/ui'`.

| Composant | Rôle |
|---|---|
| `BottomDock` | LE chrome flottant : capsule un ton SOUS le papier (`dock`) sur l'ombre la plus forte, onglet actif déployé en pilule Bleu Rondivo pleine (glyphe + label en `onAccent`), reflow sur un seul spring amorti. Mêmes cinq onglets, navigation `replace`. |
| `AppBar` | Entête d'écran : titre centré 17 pt semibold, puits d'icônes circulaires (`iconButtonBg`), barre invisible — le papier la traverse. |
| `LargeTitleBar` | Entête des cinq écrans racines : titre 30 pt aligné à gauche, eyebrow petites capitales ou sous-titre, UNE action dans un puits 44 pt (encre accent pour l'ajout). |
| `IconWell` | Le seul bouton icône : disque pressé dans le papier, sans ombre ni bordure. |
| `Button` | Une forme (capsule), quatre voix : primary (bleu), secondary (feuille + filet), ghost (texte bleu), danger (feuille + encre danger sourde). Hauteur 52 / compact 40, état loading. |
| `Card` | Feuille posée sur le papier : resting / raised (LA carte dominante, une par écran max) / flat (encastrée). Pas de bordure en clair ; filet en sombre. |
| `Badge` | Statut « encre sur lavis » nommé par ton (blue/green/orange/red/purple/teal/neutral). Le texte prend l'encre AA, le point garde la couleur vive. `critical` ajoute l'anneau. |
| `ChipRow` | LA rampe de filtres : sélection monochrome (la puce active se remplit d'encre de texte, le label passe au papier) ; les couleurs de statut restent dans les points. |
| `ListRow` + `RowSeparator` | Anatomie unique d'une ligne : tuile d'icône → titre/sous-titre → meta → chevron. |
| `SearchField` | Rainure encastrée (`inset`, sans ombre), anneau bleu au focus, puits filtre avec point actif. |
| `FormInput` | Champ de formulaire, filet → bleu au focus (même langage que SearchField). |
| `EmptyState` | Un seul état vide/erreur : médaillon lavé, deux lignes, une action max ; ton `error` en lavis rouge. |
| `SegmentedTabs`, `Shimmer`/`SkeletonBlock`, `PressableScale` | Segments, squelettes ambiants, feedback de pression canonique (scale + haptique légère). |

## 4. Anciens composants → shims

Les composants historiques (`DetailHeader`, `SearchBar`, `EmptyState`
des Documents, `ClientHeader`, `ClientSearch`, `ClientFilterChips`,
`FilterChips`, `PlanningHeader`, états Planning/Clients,
`StickyFormFooter`, `LogoutButton`) sont devenus des façades fines qui
rendent les composants du DS — tout l'existant est restylé d'un coup,
et les nouveaux écrans importent `@/components/ui` directement.

## 5. Interdits

- Couleur hex hors de `theme/palette.ts` (seule exception : le noir du
  lightbox photo).
- `shadowColor`/`shadowOffset`/`elevation` Android — uniquement les
  niveaux de `theme/elevation.ts` (boxShadow deux couches).
- Un deuxième bouton primaire visible sur un même écran.
- Une couleur vive de statut utilisée comme texte ou comme fond de
  surface.
- Une animation qui rebondit, boucle ou dépasse 320 ms pour du contenu.
