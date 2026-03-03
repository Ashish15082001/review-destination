import { AnimatePresence, motion } from "motion/react";

export function FieldError({ error }: { error?: string }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          animate={{ opacity: 1, height: "auto" }}
          initial={{ opacity: 0, height: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm text-red-500 mt-1">{error}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FieldError;
