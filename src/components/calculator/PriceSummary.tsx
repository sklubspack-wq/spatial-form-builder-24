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
      animate(scope.current, { scale: [1, 1.06, 1] }, { duration: 0.35, ease: "easeOut" });
    }
  }, [total, animate, scope]);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky-summary"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-xs sm:text-sm text-muted-foreground">
            <AnimatedPrice value={unitPrice} suffix="€" decimals={2} className="text-lg sm:text-xl font-bold gold-text" />
            <span className="text-muted-foreground ml-2">
              × <AnimatedPrice value={quantity} decimals={0} className="" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right" ref={scope}>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Total</div>
            <AnimatedPrice value={total} suffix="€" decimals={2} className="text-xl sm:text-2xl font-bold font-display text-foreground tracking-tight" />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="shimmer-btn gold-gradient text-primary-foreground font-bold px-4 py-2.5 sm:px-8 sm:py-3.5 rounded-2xl flex items-center gap-2 sm:gap-3 text-xs sm:text-sm"
            style={{ boxShadow: "0 4px 20px hsl(28 100% 52% / 0.25)" }}
          >
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            Commander
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PriceSummary;
