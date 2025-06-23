import type { ComponentProps } from "react";

import { motion, type MotionProps } from "motion/react";

type MainGridProps = ComponentProps<"main"> & MotionProps;

export const MainGrid = ({ ...props }: MainGridProps) => {
  return (
    <motion.main
      className="min-h-dvh grid grid-cols-1 md:grid-cols-[1fr_768px_1fr]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      <div className="col-auto p-4 relative max-h-screen md:col-start-2 md:col-end-3">
        {props.children}
      </div>
    </motion.main>
  );
};
