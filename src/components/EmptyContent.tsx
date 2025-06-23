import type { ComponentProps } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { type MotionProps, motion } from "motion/react";

type EmptyContentProps = ComponentProps<"div"> &
  MotionProps & {
    image: string;
    title: string;
    subTitle: string;
    buttonContent?: string;
    onClick?: () => void;
  };

export const EmptyContent = ({
  image,
  title,
  subTitle,
  onClick,
  buttonContent,
  ...props
}: EmptyContentProps) => {
  return (
    <motion.div
      className="flex justify-center items-center h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      {...props}
    >
      <Card styles="outline" flex="center" style={{ width: "360px" }}>
        <img src={image} alt="no-data" width={300} loading="eager" />

        <div className="text-center">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            {title}
          </h1>
          <h2 className="text-sm font-medium text-gray-500">{subTitle}</h2>
        </div>

        {onClick && <Button onClick={onClick}>{buttonContent}</Button>}
      </Card>
    </motion.div>
  );
};
