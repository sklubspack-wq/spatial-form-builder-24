import { motion } from "framer-motion";

interface StepProgressProps {
  totalSteps: number;
  activeStep: number;
}

const StepProgress = ({ totalSteps, activeStep }: StepProgressProps) => {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-sm mx-auto py-5">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < activeStep;
        const isActive = step === activeStep;

        return (
          <div key={step} className="flex items-center">
            <motion.div
              className={`step-dot ${
                isCompleted ? "step-dot-completed" : isActive ? "step-dot-active" : "step-dot-future"
              }`}
              animate={
                isActive
                  ? {
                      scale: [1, 1.5, 1],
                      boxShadow: [
                        "0 0 0px hsl(28 100% 52% / 0.3)",
                        "0 0 14px hsl(28 100% 52% / 0.5)",
                        "0 0 0px hsl(28 100% 52% / 0.3)",
                      ],
                    }
                  : { scale: 1 }
              }
              transition={
                isActive
                  ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  : { type: "spring", stiffness: 500, damping: 30 }
              }
            />
            {step < totalSteps && (
              <div className={`w-6 sm:w-10 step-line ${isCompleted ? "step-line-filled" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
