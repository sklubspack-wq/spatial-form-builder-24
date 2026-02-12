
# Plan : Configurateur Step-by-Step avec Reveal Progressif et Recap Final

## Concept

Transformer le configurateur d'un scroll libre en une experience **step-by-step immersive** : chaque section est masquee jusqu'a ce que la precedente soit completee. A la fin, une **carte recapitulative** apparait comme un "menu" que le client a compose, revelant l'ensemble de ses choix avec le prix final.

C'est l'equivalent d'un parcours de commande en restaurant haut de gamme : on choisit l'entree, puis le plat, puis le dessert, et a la fin on decouvre sa "carte" complete.

---

## Architecture

### 1. Logique de progression (`Index.tsx`)

- Ajouter un state `activeStep` (commence a 1)
- Definir une fonction `isSectionCompleted(sectionId)` qui verifie si une selection valide existe pour cette section :
  - Sections simples (type, size, finish) : une valeur non-vide
  - Sections multi-select (premium, technical-extras) : toujours "completee" (optionnelles), on ajoute un bouton "Continuer" pour passer a l'etape suivante
  - Sections avec subsections (material, extras) : au moins une valeur par sous-section obligatoire
  - Quantity : toujours completee (valeur par defaut)
- Quand une selection est faite sur la section active, `activeStep` avance automatiquement a l'etape suivante (avec un leger delai de 400ms pour l'animation)
- Pour les sections multi-select, un bouton "Continuer" explicite fait avancer l'etape
- L'utilisateur peut cliquer sur une section deja completee pour la modifier (elle se re-ouvre, les suivantes restent visibles mais en mode "resume")

### 2. Modification de `SectionBlock.tsx`

- Recevoir de nouvelles props : `isActive`, `isLocked`, `isCompleted`, `onContinue`
- **Etat verrouille** (`isLocked: true`) : La section est completement masquee avec `AnimatePresence`. Seul le titre avec un numero grise et un cadenas est visible
- **Etat actif** (`isActive: true`) : La section s'anime en apparition (slide-down + fade-in) avec les options cliquables. Une barre de progression en haut montre l'avancement (ex: "Etape 3/7")
- **Etat complete** (`isCompleted: true, isActive: false`) : La section se replie en un bandeau compact montrant le choix fait (ex: "1. Type de sachet -- Doypack"). Cliquable pour re-ouvrir

### 3. Bandeau compact pour sections completees

Un nouveau composant inline dans `SectionBlock.tsx` qui affiche :
- Le numero d'etape (gold)
- Le titre de la section
- Le resume du choix (label de l'option selectionnee)
- Une icone "modifier" (crayon) a droite
- Fond glass subtil, une seule ligne, cliquable

### 4. Barre de progression

Un composant `StepProgress` en haut de page (sous le header) :
- 7 points alignes horizontalement relies par une ligne
- Les points completes sont dores, le point actif pulse, les points futurs sont gris
- Animation fluide quand on progresse

### 5. Recap Final (`OrderSummary.tsx`)

Quand toutes les 7 etapes sont completees, une carte recapitulative apparait avec une animation spectaculaire (scale-in depuis le centre + blur qui se dissipe) :
- Titre "Votre Packaging" en gold
- Liste de tous les choix avec icone + label pour chaque section
- Le prix unitaire et le total en grand
- Les options premium et extras listes avec leurs prix individuels
- Le bouton "Commander maintenant" avec l'effet shimmer
- Un bouton secondaire "Modifier" pour revenir a n'importe quelle etape

---

## Flux Utilisateur

```text
[Header + Barre de progression]

Etape 1 : Type de sachet     <- ACTIVE (cartes visibles)
Etape 2 : Quantite            <- VERROUILLE (cadenas)
Etape 3 : Taille              <- VERROUILLE
...
Etape 7 : Extras              <- VERROUILLE

--- L'utilisateur clique "Doypack" ---

[1. Type -- Doypack ✓]        <- COMPLETE (bandeau compact)
Etape 2 : Quantite            <- ACTIVE (s'anime en apparition)
Etape 3 : Taille              <- VERROUILLE
...

--- Apres toutes les etapes ---

[1. Type -- Doypack ✓]
[2. Quantite -- 5 000 ✓]
[3. Taille -- M (16x24 cm) ✓]
...
[7. Extras -- Zip renforce, 2 visuels ✓]

=== CARTE RECAPITULATIVE ===
Votre Packaging Sur-Mesure
- Type : Doypack
- Quantite : 5 000
- Taille : M (16x24 cm)
...
Prix unitaire : 0.31EUR
Total TTC : 1 800.00EUR
[Commander maintenant]
```

---

## Details Techniques

### Fichiers a creer :
- `src/components/calculator/StepProgress.tsx` : Barre de progression 7 points
- `src/components/calculator/OrderSummary.tsx` : Carte recapitulative finale

### Fichiers a modifier :
- `src/pages/Index.tsx` : Ajouter `activeStep`, logique de progression, rendu conditionnel, affichage du `OrderSummary` quand `activeStep > 7`
- `src/components/calculator/SectionBlock.tsx` : Ajouter les 3 etats (locked/active/completed), le bandeau compact, le bouton "Continuer" pour les multi-select

### Animations :
- Section qui s'ouvre : `opacity 0 -> 1`, `y: 20 -> 0`, `height: 0 -> auto` via `AnimatePresence` + `motion.div`
- Section qui se replie : transition inverse avec un delai de 200ms
- Carte recap : `scale: 0.9 -> 1`, `opacity: 0 -> 1`, `filter: blur(10px) -> blur(0px)`
- Barre de progression : les points se remplissent avec une animation `spring`

### Auto-scroll :
- Quand une nouvelle section se deverrouille, `scrollIntoView({ behavior: "smooth", block: "center" })` pour amener l'utilisateur a la section suivante
