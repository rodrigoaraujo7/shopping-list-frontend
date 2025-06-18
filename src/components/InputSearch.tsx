import type { ComponentProps } from "react";

import { AnimatePresence, motion } from "motion/react";

import { Avatar } from "./Avatar";

import { RxCross2 } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";

type InputSearchProps = ComponentProps<"input"> & {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
};

export const InputSearch = ({
  state,
  setState,
  ...props
}: InputSearchProps) => {
  return (
    <div className="group w-full px-3 py-1 rounded-full flex items-center gap-4 border-[1px] border-gray-200 focus-within:border-primary-600 transition-colors">
      <CiSearch
        className="stroke-gray-500 group-focus-within:stroke-gray-900 transition-colors"
        strokeWidth={1.5}
        size={20}
      />

      <input
        type="text"
        className="py-2 flex-[1] outline-none text-sm"
        value={state}
        onChange={(e) => setState(e.target.value)}
        {...props}
      />

      <AnimatePresence mode="wait">
        {state !== "" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.1 }}
          >
            <Avatar onClick={() => setState("")}>
              <RxCross2 color="#7f56d9" />
            </Avatar>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
