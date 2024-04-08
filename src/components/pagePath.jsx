import { useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

export const PagePath = ({ className }) => {
  const { pathname } = useLocation();

  return (
    <h2 className={cn("text-2xl font-medium my-10", className)}>{pathname}</h2>
  );
};
