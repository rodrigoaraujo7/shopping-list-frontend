import type { ComponentProps } from "react";

type MainGridProps = ComponentProps<"main">;

export const MainGrid = ({ ...props }: MainGridProps) => {
  return (
    <main
      className="min-h-screen grid grid-cols-1 md:grid-cols-[1fr_768px_1fr]"
      {...props}
    >
      <div className="col-auto p-4 relative md:col-start-2 md:col-end-3">
        {props.children}
      </div>
    </main>
  );
};
