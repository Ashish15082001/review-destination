import { AnimatePresence, motion } from "motion/react";

export function FormMessage({
  type,
  message,
}: {
  type?: "success" | "error";
  message?: string;
}) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          animate={{ opacity: 1, height: "auto" }}
          initial={{ opacity: 0, height: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div
            className={`rounded-xl p-4 ${
              type === "success"
                ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
                : "bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800"
            }`}
          >
            <p
              className={`text-sm ${
                type === "success"
                  ? "text-green-700 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FormMessage;
