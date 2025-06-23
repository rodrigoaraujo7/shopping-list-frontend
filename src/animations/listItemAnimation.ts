import type { Variants } from "motion/react";

export const listItemAnimation: Variants = {
  hidden: {
    x: 150,
    opacity: 0,
  },
  visible: (index: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.1, delay: index * 0.05 },
  }),
};
