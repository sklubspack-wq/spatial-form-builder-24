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
      {/* Orbital grid */}
      <div className="grid grid-cols-4 gap-2">
        {TIERS.map((q) => {
          const isActive = selected === q;
          const price = basePriceByQuantity[q];
          return (
            <motion.button
              key={q}
              onClick={() => onSelect(q)}
              whileTap={{ scale: 0.95 }}
              className={`relative py-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-primary/15 border-primary text-foreground shadow-[0_0_20px_hsl(var(--gold-glow))]"
                  : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/50 hover:border-muted-foreground/30"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="qty-glow"
                  className="absolute inset-0 rounded-xl border-2 border-primary/50"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="block text-sm font-bold font-display">{formatQty(q)}</span>
              <span className="block text-[10px] text-muted-foreground mt-0.5">
                {price.toFixed(2)}€/u
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Custom input */}
      <div className="relative">
        <input
          type="number"
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full bg-muted/20 border-2 border-border rounded-2xl py-4 px-6 text-foreground text-center font-medium font-display focus:outline-none focus:border-primary/40 transition-all placeholder:text-muted-foreground"
          placeholder="Quantité personnalisée..."
          min={100}
        />
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] uppercase font-bold pointer-events-none tracking-wider">
          PCS
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
