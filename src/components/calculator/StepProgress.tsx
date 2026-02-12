import { motion } from "framer-motion";

interface StepProgressProps {
  totalSteps: number;
  activeStep: number;
}

const StepProgress = ({ totalSteps, activeStep }: StepProgressProps) => {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto py-6">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < activeStep;
        const isActive = step === activeStep;
        const isFuture = step > activeStep;

        return (
          <div key={step} className="flex items-center">
            {/* Dot */}
            <motion.div
              className={`relative w-3 h-3 rounded-full transition-colors duration-300 ${
                isCompleted
                  ? "bg-primary"
                  : isActive
                  ? "bg-primary"
                  : "bg-muted"
              }`}
              animate={
                isActive
                  ? { scale: [1, 1.4, 1], boxShadow: ["0 0 0px hsl(var(--gold-glow))", "0 0 12px hsl(var(--gold-glow))", "0 0 0px hsl(var(--gold-glow))"] }
                  : { scale: 1 }
              }
              transition={
                isActive
                  ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  : { type: "spring", stiffness: 500, damping: 30 }
              }
            />

            {/* Connector line */}
            {step < totalSteps && (
              <div className="w-8 sm:w-12 h-0.5 relative">
                <div className="absolute inset-0 bg-muted rounded-full" />
                <motion.div
                  className="absolute inset-0 bg-primary rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isCompleted ? 1 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
