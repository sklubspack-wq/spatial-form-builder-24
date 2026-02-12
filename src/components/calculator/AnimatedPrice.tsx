import { useEffect, useRef } from "react";
import { useMotionValue, useTransform, animate, motion } from "framer-motion";

interface AnimatedPriceProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

const AnimatedPrice = ({ value, prefix = "", suffix = "", decimals = 2, className = "" }: AnimatedPriceProps) => {
  const motionValue = useMotionValue(value);
  const displayed = useTransform(motionValue, (v) =>
    decimals > 0
      ? v.toFixed(decimals)
      : Math.round(v).toLocaleString("fr-FR")
  );
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = displayed.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${prefix}${v}${suffix}`;
    });
    return unsubscribe;
  }, [displayed, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}{decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("fr-FR")}{suffix}
    </span>
  );
};

export default AnimatedPrice;
