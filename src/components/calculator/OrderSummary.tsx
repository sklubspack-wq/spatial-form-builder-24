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

  if (section.options) {
    const val = selections[section.id];
    if (Array.isArray(val)) {
      return val.map((v) => section.options!.find((o) => o.id === v)?.label).filter(Boolean).join(", ") || "Aucune";
    }
    const opt = section.options.find((o) => o.id === val);
    return opt?.label || "";
  }

  if (section.subsections) {
    return section.subsections
      .map((sub) => {
        const val = selections[sub.id];
        if (Array.isArray(val)) return val.map((v) => sub.options.find((o) => o.id === v)?.label).filter(Boolean).join(", ");
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
      initial={{ scale: 0.92, opacity: 0, filter: "blur(12px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-6 mb-40 spatial-tray-active"
      style={{
        boxShadow: "0 0 60px hsl(28 100% 52% / 0.08), 0 16px 64px hsl(225 40% 4% / 0.6)",
      }}
    >
      {/* Header */}
      <div className="p-6 sm:p-8 text-center border-b border-border/30">
        <h2 className="text-xl sm:text-3xl font-bold font-display tracking-tight">
          <span className="gold-text">Votre Packaging</span>{" "}
          <span className="text-foreground">Sur-Mesure</span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">Récapitulatif de votre configuration</p>
      </div>

      {/* Choices */}
      <div className="p-5 sm:p-8 space-y-2">
        {calculatorSections.map((section) => {
          const label = getSelectionLabel(section.id, selections);
          if (!label) return null;

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: section.step * 0.06 }}
              className="flex items-center justify-between py-3 px-4 rounded-xl glass-tile"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold gold-text w-5">{section.step}</span>
                <div>
                  <div className="text-sm font-semibold text-foreground">{section.title}</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">{label}</div>
                </div>
              </div>
              <button
                onClick={() => onEditStep(section.step)}
                className="p-2 rounded-lg transition-colors hover:bg-accent"
              >
                <Pencil className="w-3.5 h-3.5 text-muted-foreground/60" />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Price */}
      <div className="p-5 sm:p-8 border-t border-border/30">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">Prix unitaire</div>
            <AnimatedPrice value={unitPrice} suffix="€" decimals={2} className="text-lg sm:text-xl font-bold gold-text" />
            <span className="text-xs sm:text-sm text-muted-foreground ml-2">
              × <AnimatedPrice value={quantity} decimals={0} className="" />
            </span>
          </div>
          <div className="text-right">
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">Total TTC</div>
            <AnimatedPrice value={total} suffix="€" decimals={2} className="text-2xl sm:text-3xl font-bold font-display text-foreground" />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full shimmer-btn gold-gradient text-primary-foreground font-bold py-4 rounded-2xl flex items-center justify-center gap-3 text-sm sm:text-base"
          style={{ boxShadow: "0 4px 24px hsl(28 100% 52% / 0.3)" }}
        >
          <Zap className="w-5 h-5 fill-current" />
          Commander maintenant
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
