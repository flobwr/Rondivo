# Living — le langage d'animation de Rondivo

> Une carte ne mène pas à un écran. Elle **devient** cet écran, puis revient
> exactement à sa place. L'application est un seul plan de travail.

---

## 1. Pourquoi pas une transition de navigation

La question a été tranchée par la stack, pas par goût :

| Piste | Verdict |
| --- | --- |
| `sharedTransitionTag` (Reanimated) | **Supprimé en Reanimated 4.** La version installée (4.1.7) n'expose plus ni `sharedTransitionTag` ni `SharedTransition`. C'était la seule API officielle de shared element en React Native. |
| `react-native-screens` / Expo Router | Aucune API d'élément partagé. Un `push` monte un nouvel écran dans sa propre hiérarchie native pendant que l'écran source est gelé ou démonté : il n'y a plus **un seul objet** à transformer. |
| Une carte dans une `FlatList` | Elle est **clippée par sa liste**. Elle ne peut pas voyager hors de sa ligne, quelle que soit l'animation. |

Conclusion : toute « shared element transition » construite sur la navigation
serait un fondu enchaîné entre deux sosies. C'est exactement ce que le cahier
des charges interdit.

**L'architecture retenue : on ne navigue pas.** La carte est redessinée **une
fois**, dans une couche au-dessus de toute l'application, au rectangle exact
qu'elle occupe à l'écran ; puis cette surface unique se transforme. Un objet,
un mouvement continu, une seule valeur `progress` qui vit sur le thread UI.

Bénéfice secondaire, décisif : la liste en dessous n'est jamais démontée. Le
retour n'est donc pas *approximatif*, il est **exact** — la surface se repose
sur le rectangle dont elle est née.

---

## 2. Les trois pièces

```
app/_layout.tsx
└── <LivingLayer>            ← monté UNE fois, au-dessus du navigateur
      └── <Stack/>           ← toute l'application
                             ← + la surface en expansion, dessinée par-dessus
```

| Pièce | Rôle |
| --- | --- |
| `LivingLayer` | Possède l'animation : géométrie, ombre, scrim, geste, physique. Rien d'autre dans l'app ne connaît ces valeurs. |
| `LivingCard` | Enveloppe une carte : la mesure, la confie à la couche, la masque pendant l'expansion, la révèle au retour. |
| `theme/motion.ts` | `LivingSpring`, `LivingContent`, `LivingDismiss` — la grammaire. Une surface vivante n'utilise **que** ces tokens. |

---

## 3. Utilisation

```tsx
<LivingCard detail={({ close }) => <ClientDetail id={client.id} onClose={close} />}>
  {(open, atRest) => <ClientCard client={client} onPress={open} atRest={atRest} />}
</LivingCard>
```

C'est tout. La carte hérite de la physique, du geste, de l'ombre et du retour
exact — sans une ligne d'animation au point d'appel.

### Les deux règles à respecter

1. **`open` est déclenché par la carte, pas par `LivingCard`.** Le wrapper
   n'ajoute jamais de `Pressable` : le feedback tactile, le `hitSlop` et
   l'accessibilité restent dans la carte, là où ils appartiennent.
2. **`atRest` doit être transmis.** C'est le seul exemplaire redessiné par la
   couche comme image 0 de l'expansion. Une carte qui a une animation d'entrée
   doit la neutraliser (`useEntrance({ skip })`), sinon la copie apparaît en
   fondu et l'illusion d'un objet unique se casse.

### Options

| Prop | Défaut | Rôle |
| --- | --- | --- |
| `radius` | `Radius.card` | Rayon de départ — celui de la carte. |
| `expandedRadius` | `Radius.tile` | Rayon d'arrivée. **Plus petit** : les angles se détendent quand une carte devient une page. |
| `expandedInset` | `0` | Marge entre la surface ouverte et les bords. `0` = pleine page. |
| `disabled` | `false` | Carte inerte (vide, désactivée). |

---

## 4. La chorégraphie

Une seule valeur, `progress` (0 → 1), pilote **tout** :

| Ce qui bouge | De | À |
| --- | --- | --- |
| position, taille | rectangle de la carte | rectangle plein écran |
| rayon | `radius` | `expandedRadius` |
| ombre | celle de la carte | + palier `raised`, monté en opacité |
| page derrière | nette | `palette.scrim` |
| résumé (la carte) | opaque | transparent sur `[0 → 0.34]` |
| détail | transparent | opaque sur `[0.25 → 0.82]` |

Les deux fenêtres de contenu **se chevauchent** volontairement : le détail
arrive pendant que le résumé s'en va. Aucune image de la transition ne montre
une surface vide, et rien n'« apparaît » une fois le mouvement terminé. Un
trou ici, et la transition se lit comme deux événements séparés.

Le détail est disposé **à sa taille finale dès la première image** — la couche
ne le redimensionne jamais. Aucun mot ne bouge pendant l'expansion : la
surface le découvre, elle ne le recompose pas.

---

## 5. Physique

`LivingSpring` — `damping: 30`, `stiffness: 220`, `mass: 1`.

Très légèrement sous-amorti : le dépassement est trop petit pour se voir, assez
présent pour qu'on sente une masse. Mesuré sur un rendu 390×844 : la surface
parcourt 394 → 0 px en ~500 ms, décélération continue, **aucun dépassement**,
60 images/s.

Un seul ressort pour l'ouverture, la fermeture et le relâchement du geste :
une carte relâchée d'un glissement termine exactement comme une carte touchée.

**Geste** — la surface suit le doigt dès le premier pixel (`translateY` 1:1) et
rétrécit progressivement (`scaleAtLimit`). Les seuils (`distance: 110`,
`velocity: 900`) ne décident que de ce qui se passe **au relâchement**. Le
rétrécissement est multiplié par `progress`, donc il se dénoue tout seul
pendant la fermeture : une valeur, pas deux animations à synchroniser.

---

## 6. Performance

Tout est worklet. Aucune image de la transition n'a besoin du thread JS — un
rendu lent ailleurs ne peut pas la saccader.

Le seul compromis assumé : la couche anime `width` / `height` / `left` / `top`
plutôt qu'un `transform: scale`. Un `scale` non uniforme déformerait le texte
et le rayon ; l'animation de géométrie les garde nets et permet au rayon de
diminuer **réellement**. Le coût est un layout par image sur **un seul nœud**,
ce qui reste très en dessous du budget d'une frame. Si un jour une carte à
l'intérieur devenait lourde, c'est le contenu qu'il faudrait alléger, pas la
technique qu'il faudrait changer.

---

## 7. Accessibilité

`useReducedMotion` est respecté : l'expansion et la fermeture passent en
`Timing.content` / `Timing.quick` (fondu court) au lieu du ressort. La
structure et le geste restent identiques.

---

## 8. Ce qui reste à faire

- **Contenu défilant + geste.** Le détail peut défiler, mais le geste de
  fermeture et le `ScrollView` ne se cèdent pas encore la main
  (`simultaneousWithExternalGesture`) : tirer depuis le haut du contenu ferme,
  tirer depuis une zone déjà défilée peut défiler. À câbler quand un détail
  aura vraiment besoin d'une page longue.
- **Une seule carte vivante à la fois**, par construction. C'est voulu ; une
  seconde surface simultanée n'a pas de sens dans ce langage.
- **Rotation / clavier** pendant l'ouverture : le rectangle de retour est celui
  mesuré à l'ouverture. La page ne pouvant pas défiler derrière la surface, il
  ne bouge pas ; une rotation, elle, le périmerait.
