import { motion } from "framer-motion";
import { Zap, Pencil } from "lucide-react";
import { calculatorSections } from "@/data/calculator-config";
import AnimatedPrice from "./AnimatedPrice";

interface OrderSummaryProps {
  selections: Record<string, string | string[]>;
  unitPrice: number;
  quantity: number;
  total: number;
  onEditStep: (step: number) => void;
}

const getSelectionLabel = (sectionId: string, selections: Record<string, string | string[]>): string => {
  const section = calculatorSections.find((s) => s.id === sectionId);
  if (!section) return "";

  // Direct options
  if (section.options) {
    const val = selections[section.id];
    if (Array.isArray(val)) {
      return val
        .map((v) => section.options!.find((o) => o.id === v)?.label)
        .filter(Boolean)
        .join(", ") || "Aucune";
    }
    const opt = section.options.find((o) => o.id === val);
    return opt?.label || "";
  }

  // Subsections
  if (section.subsections) {
    return section.subsections
      .map((sub) => {
        const val = selections[sub.id];
        if (Array.isArray(val)) {
          return val
            .map((v) => sub.options.find((o) => o.id === v)?.label)
            .filter(Boolean)
            .join(", ");
        }
        const opt = sub.options.find((o) => o.id === val);
        return opt?.label || "";
      })
      .filter(Boolean)
      .join(" · ");
  }

  return "";
};

const OrderSummary = ({ selections, unitPrice, quantity, total, onEditStep }: OrderSummaryProps) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-8 mb-40 rounded-3xl border-2 backdrop-blur-xl overflow-hidden"
      style={{
        background: "hsl(var(--glass))",
        borderColor: "hsl(var(--glass-selected-border))",
        boxShadow: "0 0 40px hsl(var(--gold-glow)), 0 0 80px hsl(var(--gold-glow))",
      }}
    >
      {/* Header */}
      <div className="p-6 sm:p-8 text-center border-b" style={{ borderColor: "hsl(var(--glass-border))" }}>
        <h2 className="text-2xl sm:text-3xl font-bold font-display">
          <span className="gold-text">Votre Packaging</span>{" "}
          <span className="text-foreground">Sur-Mesure</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-2">Récapitulatif de votre configuration</p>
      </div>

      {/* Choices list */}
      <div className="p-6 sm:p-8 space-y-3">
        {calculatorSections.map((section) => {
          const label = getSelectionLabel(section.id, selections);
          if (!label) return null;

          return (
            <div
              key={section.id}
              className="flex items-center justify-between py-3 px-4 rounded-xl transition-colors"
              style={{ background: "hsl(var(--muted) / 0.3)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold gold-text w-5">{section.step}</span>
                <div>
                  <div className="text-sm font-semibold text-foreground">{section.title}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </div>
              <button
                onClick={() => onEditStep(section.step)}
                className="p-2 rounded-lg transition-colors hover:bg-accent"
              >
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Price */}
      <div className="p-6 sm:p-8 border-t" style={{ borderColor: "hsl(var(--glass-border))" }}>
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Prix unitaire</div>
            <AnimatedPrice value={unitPrice} suffix="€" decimals={2} className="text-xl font-bold gold-text" />
            <span className="text-sm text-muted-foreground ml-2">
              × <AnimatedPrice value={quantity} decimals={0} className="" />
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total TTC</div>
            <AnimatedPrice value={total} suffix="€" decimals={2} className="text-3xl font-bold font-display text-foreground" />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full shimmer-btn gold-gradient text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 text-base"
        >
          <Zap className="w-5 h-5 fill-current" />
          Commander maintenant
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
