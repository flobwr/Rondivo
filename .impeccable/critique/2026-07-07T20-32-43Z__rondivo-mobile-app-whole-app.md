---
target: Rondivo mobile app (whole app)
total_score: 26
p0_count: 2
p1_count: 3
timestamp: 2026-07-07T20-32-43Z
slug: rondivo-mobile-app-whole-app
---
Method: dual-agent (A: a9ede7c4c408a5237 · B: a8cb8d6d397bce538)

## Design Health Score — Heuristiques de Nielsen

| # | Heuristique | Score | Constat clé |
|---|---|---|---|
| 1 | Visibilité de l'état du système | 3/4 | Skeletons dédiés partout, mais faux délai `setTimeout(750ms)` dans `app/plus.tsx:57` sans donnée async réelle derrière |
| 2 | Correspondance système/monde réel | 2/4 | Vocabulaire métier cohérent, mais confusion « intervention » vs « rendez-vous » (deux mots, un concept) |
| 3 | Contrôle et liberté utilisateur | 3/4 | Retour arrière cohérent ; fermeture de `MessageComposerModal` renvoie parfois plus loin que prévu |
| 4 | Cohérence et standards | 3/4 | Patron carte+chevron omniprésent, cohérent avec iOS — mais voir Anti-Patterns (monoculture) |
| 5 | Prévention des erreurs | 3/4 | `appointment/new.tsx` empêche les créneaux invalides ; `devis/new.tsx` permet de valider 0 ligne sans avertissement |
| 6 | Reconnaissance plutôt que rappel | 3/4 | Vue liste mémorisée (`usePersistentState`) |
| 7 | Flexibilité et efficacité d'usage | 2/4 | Aucun raccourci power-user (pas de swipe, pas de geste rapide) |
| 8 | Esthétique et minimalisme | 3/4 | Bon en général ; `intervention/[id].tsx` empile 10 sections sans regroupement |
| 9 | Aide au diagnostic/récupération d'erreurs | 2/4 | `EmptyState` générique partout, jamais de cause différenciée (réseau/serveur/données) |
| 10 | Aide et documentation | 2/4 | Écrans Aide/Tutoriels existent, non audités en détail |
| **Total** | | **26/40** | **Acceptable — améliorations significatives requises avant un niveau Apple/Linear** |

## Anti-Patterns Verdict

**Évaluation qualitative (Assessment A)** : pas de tells "AI slop" classiques (pas de bandeau latéral, pas de texte en dégradé, pas de scaffolding 01/02/03, pas de glassmorphism gratuit). Deux réserves : usage assez fréquent d'eyebrows uppercase trackées (31 occurrences), et surtout un risque inverse plus sérieux — **la monoculture par sur-uniformisation** : le patron « icon tile + titre/sous-titre + chevron » est ré-implémenté indépendamment dans au moins 6 fichiers (`ClientCard`, `ListRow`, `ModuleCard`, `PlusSectionCard`, `AlertsBanner`, `NotificationRow`), aplatissant la hiérarchie entre une facture impayée et un compteur de véhicules.

**Scan déterministe (Assessment B)** : `node detect.mjs --json app components` → **0 finding, exit 0**. Ce résultat est un faux négatif structurel et non un signe de propreté : les 9 règles du détecteur (side-tab, gradient-text, gray-on-color, ai-color-palette, bounce-easing, etc.) ciblent des classes Tailwind et propriétés CSS kebab-case (`background-clip:`, `font-family:`) — syntaxiquement incompatibles avec du `StyleSheet.create()` React Native en camelCase. Le détecteur bundlé n'est pas adapté à cette base de code ; ses résultats doivent être écartés au profit du grep manuel ci-dessous.

**Preuves manuelles (Assessment B)**, qui remplacent le détecteur pour ce projet :
- 25 couleurs hexadécimales codées en dur hors tokens dans 19 fichiers, dont `#D7DCE4` dupliqué à l'identique dans 7 fichiers différents (poignées de bottom-sheet) et `#E4E8EF` dans 4 fichiers.
- Ratio spacing tokenisé vs. littéral ~40/60 sur un échantillon de 15 fichiers ; ratio fontSize ~44/56.
- `constants/animation.ts` définit `PressSpring` mais un seul fichier (`PressableScale.tsx`) l'utilise réellement — 74 autres appels `Animated.spring` dupliquent leurs propres valeurs à la main, en 14 paires friction/tension distinctes, souvent des quasi-doublons dérivés (5/300, 7/300, 6/320 au lieu de 6/300).
- Aucune trace de `prefers-reduced-motion` / `AccessibilityInfo.isReduceMotionEnabled` dans tout le repo.
- Le thème sombre est du code mort confirmé : `ThemedText`/`ThemedView`/`use-color-scheme` (boilerplate Expo par défaut) ne sont importés nulle part sous `app/`, et `constants/design.ts` (le vrai système utilisé) n'a aucune variante sombre — corrobore indépendamment le constat de l'Assessment A sur `app/plus/apparence.tsx`.
- 7 boutons icône-seule sans `accessibilityLabel` ni texte visible : `hero-card.tsx` (bouton GPS), `PlanningHeader.tsx`, `InterventionHeader.tsx` (composant partagé, donc le défaut se propage à tous ses appelants), `DocumentsHeader.tsx`, `ClientHeader.tsx`, `AddressCard.tsx` (bouton copier), `TravelCard.tsx`.
- Une violation de zone tactile confirmée : `ClientFilterSheet.tsx` (StatusChip, ligne ~52-67) — `Pressable` brut sans `hitSlop`, hauteur effective estimée ~32-34px, sous le seuil de 44pt.
- Couverture des états vide/chargement/erreur incohérente : 38/70 écrans (54%) en disposent ; parmi les écrans de détail par id, `contrat/[id].tsx`, `facture/[id].tsx` et `rapport/[id].tsx` n'en ont aucun alors que `client/[id].tsx`, `devis/[id].tsx`, `intervention/[id].tsx` en ont.

**Visuel** : cible non-navigable (application mobile React Native/Expo native, sans URL web ni serveur de dev à captures) — aucune injection de script/overlay possible ; l'intégralité de la revue s'appuie sur la lecture du code source par les deux assessments.

## Overall Impression

Rondivo a un vernis de surface réellement au niveau visé (dégradés, ombres à la Apple, micro-interactions cohérentes) qui se fissure dès qu'on va deux clics plus loin que l'accueil : boutons d'action qui ouvrent une alerte « bientôt disponible », un réglage de thème sombre qui ne change rien à l'écran, des bugs de contraste documentés dans un module et non propagés à l'autre. La plus grande opportunité n'est pas visuelle — c'est de finir ce qui est déjà visuellement promis.

## What's Working

1. **`constants/shadow.ts` et `constants/animation.ts`** documentent et appliquent une vraie discipline de design system (philosophie d'ombre explicite, ressorts nommés) — rare dans ce segment d'app.
2. **`app/appointment/new.tsx`** résout élégamment "la prochaine action évidente" : le bouton de validation devient littéralement l'étape manquante ("Choisissez un client" → "Créer le rendez-vous").
3. **La discipline de contraste dans `components/documents/palette.ts`** est mesurée et documentée (commentaire citant les ratios WCAG avant/après) — la compétence existe, elle n'est simplement pas propagée partout.

## Priority Issues

**[P0] CTAs mortes dans la fiche client** — `app/client/[id].tsx` route 16 actions visibles (dont "Nouveau devis", "Nouvelle facture", "Ajouter un contact") vers `Alert.alert(..., 'Cette action sera bientôt disponible.')`. Un utilisateur pressé sur chantier tape le bouton le plus logique de l'écran et tombe sur un mur. **Fix** : router réellement vers `/devis/new?clientId=`, `/facture/new?clientId=` (les params existent déjà côté formulaires) ou griser visuellement ces actions. **Commande** : `/impeccable harden`.

**[P0] Bug de contraste couleur-comme-texte** — `components/clients/types.ts` (`STATUS_META`, `TINT_COLORS`) utilise `Palette.green`/`Palette.orange` bruts en texte (~2.3:1), alors que `components/documents/palette.ts` a déjà résolu le même problème (`greenInk`, tons durcis) documenté à ~4.5:1. Contredit directement PRODUCT.md ("contraste élevé obligatoire... lisible en plein soleil"). **Fix** : appliquer le même patron `Ink`/`DocumentsTone` à `components/clients/types.ts`. **Commande** : `/impeccable audit` puis `/impeccable polish`.

**[P1] Thème sombre fantôme** — `app/plus/apparence.tsx` propose Clair/Sombre/Automatique et persiste le choix, mais aucun composant ne consomme jamais ce réglage ; `Palette` est un objet statique unique. Un artisan qui bascule en "Sombre" et ne voit rien changer perd confiance dans le reste de l'app. **Fix** : implémenter réellement (brancher `Palette` sur le réglage) ou retirer les options non fonctionnelles. **Commande** : `/impeccable harden`.

**[P1] Parcours intervention → devis/facture rompu** — Aucun raccourci depuis une intervention terminée ou sa fiche pour créer directement le devis/la facture liée ; l'utilisateur doit ressaisir manuellement l'intervention via un picker après être passé par l'onglet Documents. Contredit le principe produit n°1 ("prochaine action évidente en moins de 2 secondes"). **Fix** : ajouter un CTA "Créer un devis"/"Facturer" dans `QuickActionsCard` de l'intervention, pré-rempli via le param `interventionId` déjà consommé par `devis/new.tsx`. **Commande** : `/impeccable layout` puis `/impeccable polish`.

**[P1] Accessibilité incomplète** — 7 boutons icône-seule sans `accessibilityLabel` (dont `InterventionHeader`, un composant partagé qui propage le défaut), et zéro gestion `prefers-reduced-motion`/`AccessibilityInfo.isReduceMotionEnabled` dans tout le repo malgré des dizaines d'animations de pression. **Fix** : ajouter les labels manquants (liste de fichiers ci-dessus) et un helper `useReducedMotion()` consulté par `PressableScale`/les animations d'entrée. **Commande** : `/impeccable audit`.

## Persona Red Flags

**Alex (power user)** : après une intervention, aucun raccourci "Créer un devis" depuis `QuickActionsCard` de l'intervention — doit ressaisir manuellement l'intervention liée via un picker après être repassé par l'onglet Documents. 4-5 taps de trop pour relier une information que l'app connaît déjà.

**Casey (mobile distrait, pouce uniquement)** : tape "Créer un devis" dans `QuickActionsBar` de la fiche client (le bouton existe, label clair) → reçoit une alerte système "bientôt disponible". Le bouton le plus logique de l'écran est un mensonge visuel.

**Persona projet — l'artisan ganté, pressé, en plein soleil** : bonnes tailles de champs et pastilles à un tap pour usage ganté (TVA, validité), mais le glisser-déposer de `LineItemsEditor` (poignée 32×32px) exige un geste de précision fine — exactement ce que PRODUCT.md demande d'éviter sous gants. Le contraste des badges de statut (vert ~2.3:1) est concrètement illisible en plein soleil sur l'écran client, où ce persona vérifierait le statut avant de facturer.

## Minor Observations

- `devis/new.tsx` valide la présence d'un client mais pas qu'au moins une ligne soit renseignée avant création.
- Bouton de création (`StickyFormFooter`) sans état de chargement pendant l'appel async — risque de double-tap créant un doublon.
- Code mort du template Expo par défaut (`themed-text.tsx`, `themed-view.tsx`, `use-color-scheme*.ts`) jamais importé sous `app/`.
- Couverture incohérente des états de chargement/erreur entre écrans de détail similaires (`contrat/[id].tsx`, `facture/[id].tsx`, `rapport/[id].tsx` n'en ont aucun contrairement à leurs équivalents).

## Questions to Consider

- Le produit a-t-il vraiment besoin d'un thème sombre au lancement, ou est-ce un réglage à retirer pour l'instant plutôt qu'à finir en urgence ?
- "Intervention" et "rendez-vous" sont-ils deux concepts métier réellement distincts, ou un seul nommé deux fois par accident de développement incrémental ?
- Si chaque carte de liste avait un poids visuel proportionnel à l'enjeu réel (argent en retard vs. compteur de véhicules), à quoi ressemblerait l'écran Documents ?
