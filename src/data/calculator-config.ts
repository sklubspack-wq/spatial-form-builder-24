export interface OptionItem {
  id: string;
  label: string;
  description?: string;
  priceAdd?: number;
  included?: boolean;
  icon?: string;
  details?: string[];
}

export interface Section {
  id: string;
  step: number;
  title: string;
  subtitle: string;
  multiSelect?: boolean;
  subsections?: {
    id: string;
    title: string;
    options: OptionItem[];
    multiSelect?: boolean;
  }[];
  options?: OptionItem[];
}

export const calculatorSections: Section[] = [
  {
    id: "type",
    step: 1,
    title: "Type de sachet",
    subtitle: "Choisissez la forme de votre emballage",
    options: [
      { id: "doypack", label: "Doypack", description: "Sachet autoportant avec fond plat", icon: "📦" },
      { id: "flat", label: "Sachet Plat", description: "Sachet classique à plat", icon: "📄" },
      { id: "shape", label: "Shape Bag", description: "Forme personnalisée originale", icon: "✨" },
    ],
  },
  {
    id: "quantity",
    step: 2,
    title: "Quantité",
    subtitle: "Plus vous commandez, plus le prix unitaire baisse",
    options: [
      { id: "250", label: "250", description: "0.60€/unité", priceAdd: 0 },
      { id: "500", label: "500", description: "0.50€/unité", priceAdd: 0 },
      { id: "1000", label: "1 000", description: "0.40€/unité", priceAdd: 0 },
      { id: "2000", label: "2 000", description: "0.32€/unité", priceAdd: 0 },
      { id: "5000", label: "5 000", description: "0.25€/unité", priceAdd: 0 },
      { id: "10000", label: "10 000", description: "0.20€/unité", priceAdd: 0 },
      { id: "15000", label: "15 000", description: "0.17€/unité", priceAdd: 0 },
      { id: "20000", label: "20 000", description: "0.15€/unité", priceAdd: 0 },
    ],
  },
  {
    id: "size",
    step: 3,
    title: "Taille",
    subtitle: "Sélectionnez les dimensions de votre sachet",
    options: [
      { id: "xs", label: "XS", description: "10×15 cm", details: ["80 ml"], included: true },
      { id: "s", label: "S", description: "13×20 cm", details: ["150 ml"], priceAdd: 0.02 },
      { id: "m", label: "M", description: "16×24 cm", details: ["250 ml"], priceAdd: 0.05 },
      { id: "l", label: "L", description: "20×30 cm", details: ["500 ml"], priceAdd: 0.08 },
      { id: "xl", label: "XL", description: "24×35 cm", details: ["1 L"], priceAdd: 0.12 },
      { id: "xxl", label: "XXL", description: "30×40 cm", details: ["2 L+"], priceAdd: 0.20 },
    ],
  },
  {
    id: "material",
    step: 4,
    title: "Matériau & Épaisseur",
    subtitle: "Choisissez la structure et l'épaisseur",
    subsections: [
      {
        id: "thickness",
        title: "Épaisseur",
        options: [
          { id: "100", label: "100μ", included: true },
          { id: "120", label: "120μ", priceAdd: 0.02 },
          { id: "150", label: "150μ", priceAdd: 0.05 },
          { id: "200", label: "200μ", priceAdd: 0.10 },
        ],
      },
      {
        id: "structure",
        title: "Structure",
        options: [
          { id: "pet-al-pe", label: "PET/AL/PE", description: "Protection maximale contre l'oxygène et la lumière" },
          { id: "pet-pe", label: "PET/PE", description: "Transparent, idéal pour montrer le produit" },
          { id: "mopp-pe", label: "MOPP/PE", description: "Résistance mécanique élevée" },
          { id: "pet-al-vmpet-pe", label: "PET/AL/VMPET/PE", description: "Barrière premium multi-couches" },
        ],
      },
    ],
  },
  {
    id: "finish",
    step: 5,
    title: "Finition",
    subtitle: "Obligatoire — Choisissez le rendu de surface",
    options: [
      { id: "glossy", label: "Brillant", description: "Éclat et couleurs vives", icon: "✦", priceAdd: 0.05 },
      { id: "matte", label: "Mat", description: "Toucher doux et élégant", icon: "◉", priceAdd: 0.06 },
      { id: "holographic", label: "Holographique", description: "Effet arc-en-ciel premium", icon: "◇", priceAdd: 0.10 },
      { id: "soft-touch", label: "Soft Touch", description: "Toucher velouté haut de gamme", icon: "☁", priceAdd: 0.08 },
    ],
  },
  {
    id: "premium",
    step: 6,
    title: "Options Premium",
    subtitle: "Multi-sélection — Sublimez votre packaging",
    multiSelect: true,
    options: [
      { id: "spot-uv", label: "Spot UV", description: "Vernis sélectif brillant sur zones clés", icon: "☀", priceAdd: 0.12 },
      { id: "metallic", label: "Dorure / Metallic", description: "Finition métallisée or ou argent", icon: "⬡", priceAdd: 0.15 },
      { id: "hot-stamping", label: "Hot Stamping", description: "Marquage à chaud premium", icon: "🔥", priceAdd: 0.18 },
      { id: "window", label: "Fenêtre transparente", description: "Fenêtre pour voir le produit", icon: "👁", priceAdd: 0.10 },
      { id: "embossing", label: "Gaufrage / Embossage", description: "Relief tactile sur le packaging", icon: "✋", priceAdd: 0.08 },
    ],
  },
  {
    id: "extras",
    step: 7,
    title: "Fermeture, Impression & Extras",
    subtitle: "Finalisez les détails techniques",
    subsections: [
      {
        id: "closure",
        title: "Fermeture",
        options: [
          { id: "zip-standard", label: "Zip standard", included: true },
          { id: "zip-reinforced", label: "Zip renforcé", priceAdd: 0.05 },
          { id: "child-safe", label: "Sécurité enfant", priceAdd: 0.10 },
          { id: "tear", label: "À déchirer", included: true },
          { id: "squeeze", label: "Squeeze", priceAdd: 0.08 },
          { id: "valve", label: "Valve de dégazage", priceAdd: 0.06 },
        ],
      },
      {
        id: "print-type",
        title: "Type d'impression",
        options: [
          { id: "simple", label: "Simple (1 face)", included: true },
          { id: "recto-verso", label: "Recto-verso", priceAdd: 0.03 },
          { id: "interior", label: "Impression intérieure", priceAdd: 0.07 },
          { id: "360", label: "Impression 360°", priceAdd: 0.12 },
        ],
      },
      {
        id: "visuals",
        title: "Nombre de visuels",
        options: [
          { id: "1v", label: "1 visuel", included: true },
          { id: "2v", label: "2 visuels", priceAdd: 0.05 },
          { id: "3v", label: "3 visuels", priceAdd: 0.10 },
          { id: "4v", label: "4 visuels", priceAdd: 0.15 },
          { id: "5v", label: "5 visuels", priceAdd: 0.20 },
          { id: "6v", label: "6+ visuels", priceAdd: 0.25 },
        ],
      },
      {
        id: "plates",
        title: "Frais de clichés",
        options: [
          { id: "new-4", label: "Nouvelle création 1-4 couleurs", priceAdd: 150 },
          { id: "new-8", label: "Création complexe 5-8 couleurs", priceAdd: 250 },
          { id: "reprint", label: "Réimpression (clichés existants)", included: true },
        ],
      },
      {
        id: "technical-extras",
        title: "Extras techniques",
        multiSelect: true,
        options: [
          { id: "euro-hole", label: "Trou européen", priceAdd: 0.02 },
          { id: "tear-notch", label: "Tear notch", priceAdd: 0.01 },
          { id: "combo", label: "Combo (trou + tear)", priceAdd: 0.03 },
          { id: "qr", label: "QR Code", priceAdd: 0.04 },
          { id: "barcode", label: "Code-barres", priceAdd: 0.03 },
          { id: "perforation", label: "Perforation détachable", priceAdd: 0.05 },
        ],
      },
    ],
  },
];

// Price lookup by quantity
export const basePriceByQuantity: Record<string, number> = {
  "250": 0.60,
  "500": 0.50,
  "1000": 0.40,
  "2000": 0.32,
  "5000": 0.25,
  "10000": 0.20,
  "15000": 0.17,
  "20000": 0.15,
};
