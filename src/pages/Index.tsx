import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { calculatorSections, basePriceByQuantity } from "@/data/calculator-config";
import SectionBlock from "@/components/calculator/SectionBlock";
import PriceSummary from "@/components/calculator/PriceSummary";
import StepProgress from "@/components/calculator/StepProgress";
import OrderSummary from "@/components/calculator/OrderSummary";

const TOTAL_STEPS = calculatorSections.length;

const getSelectionLabel = (section: typeof calculatorSections[0], selections: Record<string, string | string[]>): string => {
  if (section.options) {
    const val = selections[section.id];
    if (Array.isArray(val)) {
      return val.map((v) => section.options!.find((o) => o.id === v)?.label).filter(Boolean).join(", ") || "Aucune";
    }
    const opt = section.options.find((o) => o.id === val);
    if (section.id === "quantity") {
      const n = parseInt(val as string);
      return n >= 1000 ? `${(n / 1000).toLocaleString("fr-FR")}k` : String(n);
    }
    return opt?.label || "";
  }
  if (section.subsections) {
    return section.subsections
      .map((sub) => {
        const val = selections[sub.id];
        if (Array.isArray(val)) return val.map((v) => sub.options.find((o) => o.id === v)?.label).filter(Boolean).join(", ");
        return sub.options.find((o) => o.id === val)?.label || "";
      })
      .filter(Boolean)
      .join(" · ");
  }
  return "";
};

const Index = () => {
  const [selections, setSelections] = useState<Record<string, string | string[]>>({
    type: "",
    quantity: "250",
    size: "",
    thickness: "",
    structure: "",
    finish: "",
    premium: [],
    closure: "",
    "print-type": "",
    visuals: "",
    plates: "",
    "technical-extras": [],
  });

  const [activeStep, setActiveStep] = useState(1);

  const isSectionCompleted = useCallback(
    (section: typeof calculatorSections[0]): boolean => {
      if (section.multiSelect) return true;
      if (section.id === "quantity") return true;
      if (section.options) {
        const val = selections[section.id];
        return typeof val === "string" && val !== "";
      }
      if (section.subsections) {
        return section.subsections.every((sub) => {
          if (sub.multiSelect) return true;
          const val = selections[sub.id];
          return typeof val === "string" && val !== "";
        });
      }
      return false;
    },
    [selections]
  );

  const handleSelect = (sectionId: string, optionId: string, multi?: boolean) => {
    setSelections((prev) => {
      if (sectionId === "quantity") return { ...prev, quantity: optionId };
      if (multi) {
        const current = (prev[sectionId] as string[]) || [];
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [sectionId]: next };
      }
      return { ...prev, [sectionId]: optionId };
    });

    if (!multi) {
      const currentSection = calculatorSections[activeStep - 1];
      if (currentSection && !currentSection.multiSelect && !currentSection.subsections && currentSection.id !== "quantity") {
        setTimeout(() => {
          setActiveStep((prev) => Math.min(prev + 1, TOTAL_STEPS + 1));
        }, 400);
      }
    }
  };

  const handleContinue = () => {
    setActiveStep((prev) => Math.min(prev + 1, TOTAL_STEPS + 1));
  };

  const handleReopen = (step: number) => {
    setActiveStep(step);
  };

  const allCompleted = activeStep > TOTAL_STEPS;

  const { unitPrice, quantity, total } = useMemo(() => {
    const qtyKey = selections.quantity as string;
    const qty = parseInt(qtyKey) || 250;
    let base = basePriceByQuantity[qtyKey] || 0.60;

    const sizeSection = calculatorSections.find((s) => s.id === "size");
    const sizeOpt = sizeSection?.options?.find((o) => o.id === selections.size);
    if (sizeOpt?.priceAdd) base += sizeOpt.priceAdd;

    const matSection = calculatorSections.find((s) => s.id === "material");
    const thickSub = matSection?.subsections?.find((s) => s.id === "thickness");
    const thickOpt = thickSub?.options.find((o) => o.id === selections.thickness);
    if (thickOpt?.priceAdd) base += thickOpt.priceAdd;

    const finishSection = calculatorSections.find((s) => s.id === "finish");
    const finishOpt = finishSection?.options?.find((o) => o.id === selections.finish);
    if (finishOpt?.priceAdd) base += finishOpt.priceAdd;

    const premiumSection = calculatorSections.find((s) => s.id === "premium");
    const premiumSelections = (selections.premium as string[]) || [];
    premiumSelections.forEach((pid) => {
      const opt = premiumSection?.options?.find((o) => o.id === pid);
      if (opt?.priceAdd) base += opt.priceAdd;
    });

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

    let fixedCosts = 0;
    const platesVal = selections.plates as string;
    const platesSub = extrasSection?.subsections?.find((s) => s.id === "plates");
    const platesOpt = platesSub?.options.find((o) => o.id === platesVal);
    if (platesOpt?.priceAdd && platesOpt.priceAdd >= 1) fixedCosts += platesOpt.priceAdd;

    return { unitPrice: base, quantity: qty, total: base * qty + fixedCosts };
  }, [selections]);

  return (
    <div className="min-h-screen spatial-bg pb-32 relative z-10">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="pt-10 sm:pt-14 pb-1 px-4 sm:px-6 text-center"
      >
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight">
          <span className="gold-text">Configurateur</span>{" "}
          <span className="text-foreground">Packaging</span>
        </h1>
        <p className="text-muted-foreground mt-2 sm:mt-3 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Créez votre emballage sur-mesure. Prix calculé en temps réel.
        </p>
      </motion.header>

      {/* Progress */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <StepProgress totalSteps={TOTAL_STEPS} activeStep={activeStep} />
      </div>

      {/* Sections (Bento Grid) */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6">
        {calculatorSections.map((section) => {
          const stepIndex = section.step;
          const isActive = stepIndex === activeStep;
          const isLocked = stepIndex > activeStep;
          const isCompleted = stepIndex < activeStep;

          return (
            <SectionBlock
              key={section.id}
              section={section}
              selections={selections}
              onSelect={handleSelect}
              isActive={isActive}
              isLocked={isLocked}
              isCompleted={isCompleted}
              onContinue={handleContinue}
              onReopen={() => handleReopen(stepIndex)}
              selectionLabel={getSelectionLabel(section, selections)}
              focusDepth={!allCompleted}
            />
          );
        })}

        <AnimatePresence>
          {allCompleted && (
            <OrderSummary
              selections={selections}
              unitPrice={unitPrice}
              quantity={quantity}
              total={total}
              onEditStep={handleReopen}
            />
          )}
        </AnimatePresence>
      </main>

      <PriceSummary unitPrice={unitPrice} quantity={quantity} total={total} />
    </div>
  );
};

export default Index;
