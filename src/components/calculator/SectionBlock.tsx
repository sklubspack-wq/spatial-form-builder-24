import { motion } from "framer-motion";
import type { Section } from "@/data/calculator-config";
import OptionCard from "./OptionCard";

interface SectionBlockProps {
  section: Section;
  selections: Record<string, string | string[]>;
  onSelect: (sectionId: string, optionId: string, multi?: boolean) => void;
}

const SectionBlock = ({ section, selections, onSelect }: SectionBlockProps) => {
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-2"
    >
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
          <span className="gold-text">{section.step}.</span> {section.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{section.subtitle}</p>
      </div>

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

      <div className="section-divider" />
    </motion.section>
  );
};

export default SectionBlock;
