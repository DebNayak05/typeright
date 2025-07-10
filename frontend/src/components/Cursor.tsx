import { motion } from "framer-motion"; // make sure it's 'framer-motion', not 'motion/react'

export default function Cursor() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
      className="absolute left-0 top-1 w-1 h-7 bg-yellow-300 pointer-events-none z-50"
    />
  );
}
