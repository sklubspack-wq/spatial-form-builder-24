import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { OptionItem } from "@/data/calculator-config";

interface OptionCardProps {
  option: OptionItem;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
}

const OptionCard = ({ option, selected, onSelect, compact }: OptionCardProps) => {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative flex flex-col items-center justify-center text-center 
        ${compact ? "p-4 min-h-[80px]" : "p-5 min-h-[120px]"} 
        rounded-2xl border backdrop-blur-xl transition-colors duration-300 cursor-pointer w-full
        ${selected
          ? "glass-card-selected"
          : "glass-card"
        }`}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="check-badge"
        >
          <Check className="w-3.5 h-3.5" />
        </motion.div>
      )}

      {option.icon && !compact && (
        <span className="text-2xl mb-2">{option.icon}</span>
      )}

      <span className={`font-semibold font-display ${compact ? "text-sm" : "text-base"} text-foreground`}>
        {option.label}
      </span>

      {option.description && (
        <span className="text-xs text-muted-foreground mt-1 leading-tight">
          {option.description}
        </span>
      )}

      {option.details?.map((d, i) => (
        <span key={i} className="text-xs text-primary mt-0.5">{d}</span>
      ))}

      {option.included && (
        <span className="text-xs text-primary mt-1.5 font-medium">✓ Inclus</span>
      )}

      {option.priceAdd !== undefined && option.priceAdd > 0 && !option.included && (
        <span className="text-xs text-primary mt-1.5 font-medium">
          +{option.priceAdd >= 1 ? option.priceAdd.toFixed(2) : option.priceAdd.toFixed(2)}€
        </span>
      )}
    </motion.button>
  );
};

export default OptionCard;
