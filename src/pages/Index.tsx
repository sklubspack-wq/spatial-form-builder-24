import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { calculatorSections, basePriceByQuantity } from "@/data/calculator-config";
import SectionBlock from "@/components/calculator/SectionBlock";
import PriceSummary from "@/components/calculator/PriceSummary";

const Index = () => {
  const [selections, setSelections] = useState<Record<string, string | string[]>>({
    type: "doypack",
    quantity: "250",
    size: "xs",
    thickness: "100",
    structure: "pet-al-pe",
    finish: "matte",
    premium: [],
    closure: "zip-standard",
    "print-type": "simple",
    visuals: "1v",
    plates: "reprint",
    "technical-extras": [],
  });

  const handleSelect = (sectionId: string, optionId: string, multi?: boolean) => {
    setSelections((prev) => {
      // Quantity uses direct value setting from orbital selector
      if (sectionId === "quantity") {
        return { ...prev, quantity: optionId };
      }
      if (multi) {
        const current = (prev[sectionId] as string[]) || [];
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [sectionId]: next };
      }
      return { ...prev, [sectionId]: optionId };
    });
  };

  const { unitPrice, quantity, total } = useMemo(() => {
    const qtyKey = selections.quantity as string;
    const qty = parseInt(qtyKey) || 250;
    let base = basePriceByQuantity[qtyKey] || 0.60;

    // Add size cost
    const sizeSection = calculatorSections.find((s) => s.id === "size");
    const sizeOpt = sizeSection?.options?.find((o) => o.id === selections.size);
    if (sizeOpt?.priceAdd) base += sizeOpt.priceAdd;

    // Add thickness cost
    const matSection = calculatorSections.find((s) => s.id === "material");
    const thickSub = matSection?.subsections?.find((s) => s.id === "thickness");
    const thickOpt = thickSub?.options.find((o) => o.id === selections.thickness);
    if (thickOpt?.priceAdd) base += thickOpt.priceAdd;

    // Add finish cost
    const finishSection = calculatorSections.find((s) => s.id === "finish");
    const finishOpt = finishSection?.options?.find((o) => o.id === selections.finish);
    if (finishOpt?.priceAdd) base += finishOpt.priceAdd;

    // Add premium options
    const premiumSection = calculatorSections.find((s) => s.id === "premium");
    const premiumSelections = (selections.premium as string[]) || [];
    premiumSelections.forEach((pid) => {
      const opt = premiumSection?.options?.find((o) => o.id === pid);
      if (opt?.priceAdd) base += opt.priceAdd;
    });

    // Add extras subsection costs
    const extrasSection = calculatorSections.find((s) => s.id === "extras");
    extrasSection?.subsections?.forEach((sub) => {
      const val = selections[sub.id];
      if (sub.multiSelect && Array.isArray(val)) {
        val.forEach((vid) => {
          const opt = sub.options.find((o) => o.id === vid);
          if (opt?.priceAdd && opt.priceAdd < 1) base += opt.priceAdd;
        });
      } else if (typeof val === "string") {
        const opt = sub.options.find((o) => o.id === val);
        if (opt?.priceAdd && opt.priceAdd < 1) base += opt.priceAdd;
      }
    });

    // Fixed costs (plates)
    let fixedCosts = 0;
    const platesVal = selections.plates as string;
    const platesSub = extrasSection?.subsections?.find((s) => s.id === "plates");
    const platesOpt = platesSub?.options.find((o) => o.id === platesVal);
    if (platesOpt?.priceAdd && platesOpt.priceAdd >= 1) fixedCosts += platesOpt.priceAdd;

    return {
      unitPrice: base,
      quantity: qty,
      total: base * qty + fixedCosts,
    };
  }, [selections]);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-12 pb-8 px-4 sm:px-6 text-center"
      >
        <h1 className="text-3xl sm:text-5xl font-bold font-display">
          <span className="gold-text">Configurateur</span>{" "}
          <span className="text-foreground">Packaging</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-sm sm:text-base max-w-xl mx-auto">
          Créez votre emballage sur-mesure en quelques clics. Prix calculé en temps réel.
        </p>
      </motion.header>

      {/* Sections */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        {calculatorSections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            selections={selections}
            onSelect={handleSelect}
          />
        ))}
      </main>

      {/* Sticky Price */}
      <PriceSummary unitPrice={unitPrice} quantity={quantity} total={total} />
    </div>
  );
};

export default Index;
