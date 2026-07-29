import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
}: Props) {

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
      }}

      viewport={{
        once: true,
        amount: 0.2,
      }}

      transition={{
        duration: 0.7,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}