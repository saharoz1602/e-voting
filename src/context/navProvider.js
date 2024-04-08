import { createContext, useContext, useEffect, useState } from "react";
import { useWindowSize } from "@/src/hooks/useWindowSize";

const defaultValues = {
  isOpen: false,
  isMobile: false,
  onClose: () => {},
  onOpen: () => {},
};
export const NavContext = createContext(defaultValues);

export const NavProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { width } = useWindowSize();
  const isMobile = width <= 1021;
  const onClose = () => {
    setIsOpen(false);
  };
  const onOpen = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);
  return (
    <NavContext.Provider
      value={{
        isOpen,
        isMobile,
        onClose,
        onOpen,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export const useNavContext = () => useContext(NavContext);
