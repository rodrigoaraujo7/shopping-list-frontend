import { useRef, type ComponentProps } from "react";
import { motion } from "motion/react";
import { Avatar } from "./Avatar";
import { RxCross2 } from "react-icons/rx";

type ModalProps = ComponentProps<"div"> & {
  title: string;
  onClose: () => void;
};

export const Modal = ({ title, onClose, ...props }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 p-4 flex justify-center items-center bg-[#00000090]"
      onClick={handleClickOutside}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="bg-white p-6 w-fit h-fit max-w-full rounded-4xl md:min-w-[425px] md:max-w-[768px]"
        ref={modalRef}
        {...props}
      >
        <header className="flex items-center justify-between gap-4 mb-3">
          <h1 className=" text-lg md:text-2xl font-bold text-gray-700 text-ellipsis overflow-hidden whitespace-nowrap">
            {title}
          </h1>

          <Avatar onClick={onClose}>
            <RxCross2 color="#7f56d9" />
          </Avatar>
        </header>

        {props.children}
      </div>
    </motion.div>
  );
};
