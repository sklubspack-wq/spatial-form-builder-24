import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

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
            <div className="text-2xl font-bold font-display text-foreground">{total.toFixed(2)}€</div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="gold-gradient text-primary-foreground font-semibold px-8 py-3 rounded-xl flex items-center gap-2 shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Commander & Payer
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceSummary;
