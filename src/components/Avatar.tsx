import type { ComponentProps } from "react";
import { type MotionProps, motion } from "motion/react";

type AvatarProps = ComponentProps<"button"> & MotionProps;

export const Avatar = ({ ...props }: AvatarProps) => {
  return (
    <motion.button className="p-2 rounded-full bg-primary-50" {...props}>
      {props.children}
    </motion.button>
  );
};
