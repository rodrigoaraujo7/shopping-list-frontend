import { useEffect, useRef, type ComponentProps } from "react";

import { AnimatePresence, motion } from "motion/react";
import { CgSpinner } from "react-icons/cg";

type ButtonProps = ComponentProps<"button"> & {
  isFetching?: boolean;
};

export const Button = ({ isFetching, ...props }: ButtonProps) => {
  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = true;
  }, []);

  return (
    <button
      className="w-full p-4 bg-primary-600 rounded-[8px] text-sm text-white font-medium outline-none flex justify-center items-center"
      {...props}
    >
      <AnimatePresence mode="wait">
        {isFetching ? (
          <motion.span
            key="spinner"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="block"
          >
            <CgSpinner className="animate-spin" size={20} />
          </motion.span>
        ) : (
          <motion.span
            key="create"
            initial={hasMounted.current ? { y: 30, opacity: 0 } : false}
            animate={hasMounted.current ? { y: 0, opacity: 1 } : false}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="block"
          >
            {props.children}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};
