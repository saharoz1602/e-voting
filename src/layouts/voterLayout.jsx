import { FaHome } from "react-icons/fa";
import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { NavProvider } from "../context/navProvider";

const paths = [
  {
    href: "/voter",
    path: "Home",
    icon: <FaHome />,
  },
];

export const VoterLayout = ({ children }) => {
  return (
    <NavProvider>
      <div className="min-h-screen flex">
        <Sidebar paths={paths} />

        <div className="flex-grow flex flex-col max-w-[98rem] mx-auto w-full">
          <Header />
          <main className="flex-grow px-5">{children}</main>
        </div>
      </div>
    </NavProvider>
  );
};
