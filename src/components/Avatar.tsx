import type { ComponentProps } from "react";

type AvatarProps = ComponentProps<"button">;

export const Avatar = ({ ...props }: AvatarProps) => {
  return (
    <button className="p-2 rounded-full bg-primary-50" {...props}>
      {props.children}
    </button>
  );
};
