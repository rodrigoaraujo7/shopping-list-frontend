import type { Variants } from "motion/react";

export const blurTextAnimation: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(2px)",
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
  },
};

export const blurTextListAnimation: Variants = {
  hidden: {
    filter: "blur(2px)",
  },
  visible: (index: number) => ({
    filter: "blur(0px)",
    transition: { delay: index * 0.1 },
  }),
};
