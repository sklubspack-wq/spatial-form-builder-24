import { motion } from "framer-motion";
import { basePriceByQuantity } from "@/data/calculator-config";

interface QuantitySelectorProps {
  selected: string;
  onSelect: (qty: string) => void;
}

const TIERS = Object.keys(basePriceByQuantity);

const formatQty = (q: string) => {
  const n = parseInt(q);
  return n >= 1000 ? `${n / 1000}k` : q;
};

const QuantitySelector = ({ selected, onSelect }: QuantitySelectorProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {TIERS.map((q, i) => {
          const isActive = selected === q;
          const price = basePriceByQuantity[q];
          return (
            <motion.button
              key={q}
              onClick={() => onSelect(q)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 400, damping: 30 }}
              whileTap={{ scale: 0.97 }}
              className={`relative py-4 rounded-[18px] cursor-pointer transition-all duration-300 ${
                isActive ? "glass-tile-selected" : "glass-tile"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="qty-glow"
                  className="absolute inset-0 rounded-[18px]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="block text-sm font-bold font-display relative z-10">{formatQty(q)}</span>
              <span className="block text-[10px] text-muted-foreground mt-0.5 relative z-10">
                {price.toFixed(2)}€/u
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="relative">
        <input
          type="number"
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full glass-tile py-4 px-6 text-foreground text-center font-medium font-display focus:outline-none transition-all placeholder:text-muted-foreground border-none"
          style={{ background: "hsl(220 25% 14% / 0.3)" }}
          placeholder="Quantité personnalisée..."
          min={100}
        />
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-[10px] uppercase font-bold pointer-events-none tracking-widest">
          PCS
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
