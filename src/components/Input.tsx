import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  label: string;
};

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <label
      htmlFor={props.id}
      className="w-full flex flex-col gap-[6px] text-sm text-gray-700 font-medium"
    >
      {label}
      <input
        className="border-[1px] border-gray-300 rounded-lg outline-none py-2.5 px-3.5 font-normal text-md placeholder-gray-500 transition-all focus:border-primary-400"
        {...props}
      />
    </label>
  );
};
