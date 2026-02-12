import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Pencil, Check, ChevronRight } from "lucide-react";
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
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6";
  };

  const isQuantitySection = section.id === "quantity";
  const isMultiSelect = section.multiSelect || section.subsections?.some((s) => s.multiSelect);

  // Auto-scroll when becoming active
  useEffect(() => {
    if (isActive && ref.current) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  }, [isActive]);

  // -- LOCKED STATE --
  if (isLocked) {
    return (
      <div ref={ref} className="mb-2 py-4 px-4 rounded-2xl flex items-center gap-3 opacity-40">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-muted text-muted-foreground text-sm font-bold">
          {section.step}
        </div>
        <span className="text-sm font-medium text-muted-foreground">{section.title}</span>
        <Lock className="w-4 h-4 text-muted-foreground ml-auto" />
      </div>
    );
  }

  // -- COMPLETED (collapsed) STATE --
  if (isCompleted && !isActive) {
    return (
      <motion.button
        ref={ref as any}
        onClick={onReopen}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2 w-full py-4 px-4 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-200 hover:bg-accent/50 text-left"
        style={{
          background: "hsl(var(--glass) / 0.5)",
          borderWidth: 1,
          borderColor: "hsl(var(--glass-border))",
        }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center gold-gradient text-primary-foreground text-sm font-bold">
          <Check className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-foreground">{section.title}</span>
          <span className="text-xs text-muted-foreground ml-2 truncate">{selectionLabel}</span>
        </div>
        <Pencil className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      </motion.button>
    );
  }

  // -- ACTIVE STATE --
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-2"
    >
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
          <span className="gold-text">{section.step}.</span> {section.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{section.subtitle}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {isQuantitySection ? (
            <QuantitySelector
              selected={selections.quantity as string}
              onSelect={(qty) => onSelect("quantity", qty)}
            />
          ) : (
            <>
              {section.options && (
                <div className={`grid gap-3 ${gridCols(section.options.length)}`}>
                  {section.options.map((opt) => (
                    <OptionCard
                      key={opt.id}
                      option={opt}
                      selected={isSelected(section.id, opt.id)}
                      onSelect={() => onSelect(section.id, opt.id, section.multiSelect)}
                      compact={section.options!.length > 5}
                    />
                  ))}
                </div>
              )}

              {section.subsections?.map((sub) => (
                <div key={sub.id} className="mt-6">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                    {sub.title}
                  </h3>
                  <div className={`grid gap-3 ${gridCols(sub.options.length)}`}>
                    {sub.options.map((opt) => (
                      <OptionCard
                        key={opt.id}
                        option={opt}
                        selected={isSelected(sub.id, opt.id)}
                        onSelect={() => onSelect(sub.id, opt.id, sub.multiSelect)}
                        compact={sub.options.length > 4}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Continue button for multi-select or always-complete sections */}
          {(isMultiSelect || isQuantitySection || section.subsections) && (
            <motion.button
              onClick={onContinue}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-6 w-full sm:w-auto px-8 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 gold-gradient text-primary-foreground shadow-lg shadow-primary/20"
            >
              Continuer
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="section-divider" />
    </motion.section>
  );
};

export default SectionBlock;
