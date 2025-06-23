import type { Variants } from "motion/react";

export const filteredListItemAnimation: Variants = {
  hidden: {
    y: 30,
  },
  visible: (index: number) => ({
    y: 0,
    transition: { duration: 0.1, delay: index * 0.025 },
  }),
};
