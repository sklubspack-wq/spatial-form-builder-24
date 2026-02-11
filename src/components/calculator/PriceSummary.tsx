import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface PriceSummaryProps {
  unitPrice: number;
  quantity: number;
  total: number;
}

const PriceSummary = ({ unitPrice, quantity, total }: PriceSummaryProps) => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="sticky-summary"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="text-sm text-muted-foreground">
            Prix unitaire{" "}
            <span className="text-xl font-bold gold-text">{unitPrice.toFixed(2)}€</span>
            <span className="text-muted-foreground ml-2">× {quantity.toLocaleString("fr-FR")}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total TTC</div>
            <div className="text-2xl font-bold font-display text-foreground tracking-tight">{total.toFixed(2)}€</div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="shimmer-btn gold-gradient text-primary-foreground font-bold px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20"
          >
            <Zap className="w-5 h-5 fill-current" />
            Commander maintenant
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceSummary;
