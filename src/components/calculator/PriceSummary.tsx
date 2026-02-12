import { useEffect, useRef } from "react";
import { motion, useAnimate } from "framer-motion";
import { Zap } from "lucide-react";
import AnimatedPrice from "./AnimatedPrice";

interface PriceSummaryProps {
  unitPrice: number;
  quantity: number;
  total: number;
}

const PriceSummary = ({ unitPrice, quantity, total }: PriceSummaryProps) => {
  const [scope, animate] = useAnimate();
  const prevTotal = useRef(total);

  useEffect(() => {
    if (prevTotal.current !== total) {
      prevTotal.current = total;
      animate(scope.current, { scale: [1, 1.08, 1] }, { duration: 0.4, ease: "easeOut" });
    }
  }, [total, animate, scope]);

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
            <AnimatedPrice value={unitPrice} suffix="€" decimals={2} className="text-xl font-bold gold-text" />
            <span className="text-muted-foreground ml-2">
              × <AnimatedPrice value={quantity} decimals={0} className="" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right" ref={scope}>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Total TTC</div>
            <AnimatedPrice value={total} suffix="€" decimals={2} className="text-2xl font-bold font-display text-foreground tracking-tight" />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="shimmer-btn gold-gradient text-primary-foreground font-bold px-4 py-3 sm:px-8 sm:py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20 text-sm sm:text-base"
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
