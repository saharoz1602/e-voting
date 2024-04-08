import { CiMenuFries } from "react-icons/ci";
import { useNavContext } from "../context/navProvider";
import { ConnectButton } from "./connectButton";

export const Header = () => {
  const { onOpen } = useNavContext();

  return (
    <header className="py-4 px-10">
      <div className="flex justify-between">
        <div>
          <button
            id="modal-button"
            className="lg:hidden p-2 bg-primary h-full flex items-center"
            onClick={onOpen}
          >
            <CiMenuFries className="w-8 h-6" />
          </button>
        </div>
        <div className="max-w-52 w-full">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};
