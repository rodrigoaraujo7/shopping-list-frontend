import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const input = tv({
  base: "border-[1px] border-gray-300 rounded-lg outline-none py-2.5 px-3.5 font-normal text-md placeholder-gray-500 transition-all focus:border-primary-400",
  variants: {
    styles: {
      error: "border-auxiliary-red focus:border-auxiliary-red",
    },
  },
});

type InputProps = ComponentProps<"input"> &
  VariantProps<typeof input> & {
    label: string;
  };

export const Input = ({ label, styles, ...props }: InputProps) => {
  return (
    <label
      htmlFor={props.id}
      className="w-full flex flex-col gap-[6px] text-sm text-gray-700 font-medium"
    >
      {label}
      <input className={input({ styles })} autoComplete="off" {...props} />
    </label>
  );
};
