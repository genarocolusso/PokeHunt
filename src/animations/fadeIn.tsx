import { motion } from "framer-motion";
import type React from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number; // delay in seconds
  duration?: number; // optional duration
  classprop?: string;
}

export const FadeInMotion = ({ children, delay = 0, duration = 1.5, classprop = "" }: FadeInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay, duration, ease: "easeOut" }}
      viewport={{ once: true }} // runs only once when in view
      className={classprop}
    >
      {children}
    </motion.div>
  );
};
