import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { OptionItem } from "@/data/calculator-config";

interface OptionCardProps {
  option: OptionItem;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
  disabled?: boolean;
}

const OptionCard = ({ option, selected, onSelect, compact, disabled }: OptionCardProps) => {
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--mouse-x", `${x}%`);
    cardRef.current.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  return (
    <motion.button
      ref={cardRef}
      onClick={disabled ? undefined : onSelect}
      onMouseMove={handleMouseMove}
      whileHover={disabled ? {} : { y: -2, scale: 1.015 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`relative flex flex-col items-center justify-center text-center w-full
        ${compact ? "p-3 sm:p-4 min-h-[72px]" : "p-4 sm:p-5 min-h-[100px] sm:min-h-[110px]"} 
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${selected ? "glass-tile-selected" : "glass-tile"}`}
    >
      {/* Specular highlight */}
      <div className="specular-highlight" />

      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="check-badge"
        >
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </motion.div>
      )}

      <motion.div
        animate={{ scale: selected ? 1.04 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center relative z-10"
      >
        {option.icon && !compact && (
          <span className="text-xl sm:text-2xl mb-1.5">{option.icon}</span>
        )}

        <span className={`font-semibold font-display ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"} text-foreground`}>
          {option.label}
        </span>

        {option.description && (
          <span className="text-[10px] sm:text-xs text-muted-foreground mt-1 leading-tight max-w-[140px]">
            {option.description}
          </span>
        )}

        {option.details?.map((d, i) => (
          <span key={i} className="text-[10px] sm:text-xs text-primary mt-0.5 font-medium">{d}</span>
        ))}

        {option.included && (
          <span className="text-[10px] sm:text-xs text-primary mt-1 font-medium">✓ Inclus</span>
        )}

        {option.priceAdd !== undefined && option.priceAdd > 0 && !option.included && (
          <span className="text-[10px] sm:text-xs text-primary mt-1 font-medium">
            +{option.priceAdd.toFixed(2)}€
          </span>
        )}
      </motion.div>
    </motion.button>
  );
};

export default OptionCard;
