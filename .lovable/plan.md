

# Plan : Micro-animations de transition pour le prix

## Constat apres tests

### Pricing engine : OK
- Quantite 250 -> 0.66EUR x 250 = 165EUR (base 0.60 + finish mat 0.06)
- Quantite 5000 -> 0.31EUR x 5000 = 1550EUR (base 0.25 + finish mat 0.06)
- Cliches +250EUR -> total passe a 1800EUR
- Multi-select premium, extras techniques : fonctionnels

### Responsive mobile (390px) : OK
- Les cartes passent en 1 colonne (type) ou 2 colonnes (finish, premium)
- La barre de prix sticky reste visible et lisible
- Le bouton "Commander" fonctionne mais le texte se coupe un peu sur 2 lignes

### Responsive tablette (768px) : OK
- Layout intermediaire correct entre mobile et desktop

### Probleme identifie
Les changements de prix (unitaire et total) sont instantanes, sans transition visuelle. L'utilisateur ne percoit pas le changement.

---

## Implementation : Compteur anime (Animated Counter)

### 1. Creer un composant `AnimatedPrice`
- Fichier : `src/components/calculator/AnimatedPrice.tsx`
- Utilise `framer-motion` avec `useMotionValue` et `useTransform` pour animer le nombre de l'ancienne valeur vers la nouvelle
- Affiche le prix avec un effet de "rolling counter" fluide (interpolation numerique sur ~0.5s)
- Props : `value: number`, `prefix?: string`, `suffix?: string`, `decimals?: number`, `className?: string`

### 2. Modifier `PriceSummary.tsx`
- Remplacer les `{unitPrice.toFixed(2)}` et `{total.toFixed(2)}` statiques par le composant `AnimatedPrice`
- Remplacer `{quantity.toLocaleString("fr-FR")}` par un `AnimatedPrice` aussi (sans decimales)
- Ajouter un leger `scale` pulse sur le total quand la valeur change (via `useEffect` + `animate`)

### 3. Fix mineur mobile
- Reduire le padding du bouton CTA sur mobile (`px-4 py-3 sm:px-8 sm:py-4`) pour eviter le retour a la ligne du texte
- Reduire la taille du texte "Commander maintenant" sur mobile (`text-sm sm:text-base`)

---

## Details techniques

Le composant `AnimatedPrice` utilisera :
```
const motionValue = useMotionValue(value)
const rounded = useTransform(motionValue, v => v.toFixed(decimals))

useEffect(() => {
  const controls = animate(motionValue, value, {
    duration: 0.5,
    ease: "easeOut"
  })
  return controls.stop
}, [value])
```

Cela donne un effet de compteur qui "roule" entre l'ancien et le nouveau prix, similaire aux animations de prix dans les apps fintech iOS.

