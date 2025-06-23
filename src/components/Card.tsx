import type { ComponentProps } from "react";
import { motion, type MotionProps } from "motion/react";

import { tv, type VariantProps } from "tailwind-variants";

const card = tv({
  base: "w-full h-fit p-6 flex flex-col origin-top transition-[.15s]",
  variants: {
    styles: {
      soft: "bg-gray-25 rounded-xl border-[1px] border-gray-200 gap-2",
      colored: "bg-primary-50 rounded-xl border-[1px] border-primary-300 gap-2",
      outline:
        "bg-white rounded-3xl border-[1px] border-gray-200 border-dashed gap-4",
    },
    flex: {
      base: "items-start justify-start",
      center: "items-center justify-center",
    },
  },
  defaultVariants: {
    styles: "soft",
    flex: "base",
  },
});

type CardProps = ComponentProps<"div"> &
  VariantProps<typeof card> &
  MotionProps;

export const Card = ({ styles, flex, className, ...props }: CardProps) => {
  return (
    <motion.div className={card({ styles, flex, className })} {...props}>
      {props.children}
    </motion.div>
  );
};
