import { CgSpinner } from "react-icons/cg";

export const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center min-h-dvh">
      <CgSpinner className="animate-spin" size={75} color="#7f56d9" />
    </div>
  );
};
