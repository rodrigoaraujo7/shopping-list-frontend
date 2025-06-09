import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;

export const Button = ({ ...props }: ButtonProps) => {
  return (
    <button
      className="w-full p-4 bg-primary-600 rounded-[8px] text-sm text-white font-medium outline-none"
      {...props}
    >
      {props.children}
    </button>
  );
};
