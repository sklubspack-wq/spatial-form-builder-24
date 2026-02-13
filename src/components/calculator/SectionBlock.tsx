import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Check, ChevronRight, Pencil } from "lucide-react";
import type { Section } from "@/data/calculator-config";
import OptionCard from "./OptionCard";
import QuantitySelector from "./QuantitySelector";

interface SectionBlockProps {
  section: Section;
  selections: Record<string, string | string[]>;
  onSelect: (sectionId: string, optionId: string, multi?: boolean) => void;
  isActive: boolean;
  isLocked: boolean;
  isCompleted: boolean;
  onContinue: () => void;
  onReopen: () => void;
  selectionLabel: string;
  focusDepth?: boolean;
}

const SectionBlock = ({
  section,
  selections,
  onSelect,
  isActive,
  isLocked,
  isCompleted,
  onContinue,
  onReopen,
  selectionLabel,
  focusDepth,
}: SectionBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const isSelected = (sectionId: string, optionId: string) => {
    const val = selections[sectionId];
    if (Array.isArray(val)) return val.includes(optionId);
    return val === optionId;
  };

  const gridCols = (count: number) => {
    if (count <= 3) return "grid-cols-1 sm:grid-cols-3";
    if (count <= 4) return "grid-cols-2 sm:grid-cols-4";
    if (count <= 5) return "grid-cols-2 sm:grid-cols-5";
    return "grid-cols-2 sm:grid-cols-3";
  };

  const isQuantitySection = section.id === "quantity";
  const isMultiSelect = section.multiSelect || section.subsections?.some((s) => s.multiSelect);

  useEffect(() => {
    if (isActive && ref.current) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 250);
    }
  }, [isActive]);

  // Desaturation for focus depth
  const depthStyle = focusDepth && !isActive ? { filter: "saturate(0.5) brightness(0.85)", transition: "filter 0.5s ease" } : { transition: "filter 0.5s ease" };

  // ── LOCKED ──
  if (isLocked) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={depthStyle}
        className="mb-3"
      >
        <div className="spatial-tray-locked p-5 sm:p-6 flex items-center gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted/30 text-muted-foreground text-sm font-bold font-display">
            {section.step}
          </div>
          <div className="flex-1">
            <span className="text-sm font-semibold text-muted-foreground/60">{section.title}</span>
            <p className="text-[10px] text-muted-foreground/40 mt-0.5">Débloquez l'étape précédente</p>
          </div>
          <Lock className="w-4 h-4 text-muted-foreground/30" />
        </div>
      </motion.div>
    );
  }

  // ── COMPLETED ──
  if (isCompleted && !isActive) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={depthStyle}
        className="mb-3"
      >
        <button
          onClick={onReopen}
          className="spatial-tray-completed w-full p-4 sm:p-5 flex items-center gap-4 text-left"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center gold-gradient text-primary-foreground">
            <Check className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-foreground">{section.title}</span>
            <span className="text-xs text-muted-foreground ml-2 truncate">{selectionLabel}</span>
          </div>
          <Pencil className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
        </button>
      </motion.div>
    );
  }

  // ── ACTIVE ──
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={depthStyle}
      className="mb-3"
    >
      <div className="spatial-tray-active p-5 sm:p-8">
        {/* Header */}
        <div className="mb-5 sm:mb-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
              Étape {section.step}
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-bold font-display text-foreground tracking-tight">
            {section.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{section.subtitle}</p>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={section.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isQuantitySection ? (
              <QuantitySelector
                selected={selections.quantity as string}
                onSelect={(qty) => onSelect("quantity", qty)}
              />
            ) : (
              <>
                {section.options && (
                  <div className={`grid gap-2.5 sm:gap-3 ${gridCols(section.options.length)}`}>
                    {section.options.map((opt, i) => (
                      <motion.div
                        key={opt.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, type: "spring", stiffness: 400, damping: 30 }}
                      >
                        <OptionCard
                          option={opt}
                          selected={isSelected(section.id, opt.id)}
                          onSelect={() => onSelect(section.id, opt.id, section.multiSelect)}
                          compact={section.options!.length > 5}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {section.subsections?.map((sub) => (
                  <div key={sub.id} className="mt-5 sm:mt-6">
                    <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground/70 mb-2.5 uppercase tracking-widest">
                      {sub.title}
                    </h3>
                    <div className={`grid gap-2.5 sm:gap-3 ${gridCols(sub.options.length)}`}>
                      {sub.options.map((opt, i) => (
                        <motion.div
                          key={opt.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, type: "spring", stiffness: 400, damping: 30 }}
                        >
                          <OptionCard
                            option={opt}
                            selected={isSelected(sub.id, opt.id)}
                            onSelect={() => onSelect(sub.id, opt.id, sub.multiSelect)}
                            compact={sub.options.length > 4}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Continue for multi-select / quantity / subsections */}
            {(isMultiSelect || isQuantitySection || section.subsections) && (
              <motion.button
                onClick={onContinue}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="mt-5 sm:mt-6 w-full sm:w-auto px-6 sm:px-8 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 gold-gradient text-primary-foreground shadow-lg"
                style={{ boxShadow: "0 4px 20px hsl(28 100% 52% / 0.25)" }}
              >
                Continuer
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SectionBlock;
