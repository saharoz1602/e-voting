import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccount, usePublicClient } from "wagmi";

import { FaHome } from "react-icons/fa";
import { MdHowToVote } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { GiVote } from "react-icons/gi";

import { Header } from "../components/header";
import { Sidebar } from "../components/sidebar";
import { NavProvider } from "../context/navProvider";

import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";
import { homePageConfig } from "../configs/homeConfg";
import { ADMIN_ROLE } from "../lib/constants";

const paths = [
  {
    href: "/admin",
    path: "Home",
    icon: <FaHome />,
  },
  {
    href: "/admin/manage-admins",
    path: "Admins",
    icon: <RiAdminFill />,
  },
  {
    href: "/admin/manage-elections",
    path: "Elections",
    icon: <GiVote />,
  },
  {
    href: "/admin/manage-voters",
    path: "Voters",
    icon: <MdHowToVote />,
  },
];

const adminPages = [
  "/admin",
  "/admin/manage-admins",
  "/admin/manage-voters",
  "/admin/manage-elections",
  "/admin/election",
];
export const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const currentPath = useLocation();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  /**
   * States
   */
  const [isAdmin, setIsAdmin] = useState(false);
  const isRoleChecked = useRef(false);

  const onWalletChange = useCallback(
    async (address) => {
      try {
        const isAdmin = await publicClient.readContract({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "hasRole",
          args: [ADMIN_ROLE, address],
        });

        const user = isAdmin ? "admin" : "voter";
        const path = homePageConfig[user];

        setIsAdmin(isAdmin);
        navigate(path);
      } catch (err) {}

      isRoleChecked.current = true;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [publicClient, navigate]
  );

  useEffect(() => {
    address && onWalletChange(address);
  }, [address, onWalletChange]);

  useEffect(() => {
    const onPathChange = () => {
      const pathname = currentPath.pathname;
      if (!isAdmin) navigate("/");
      if (
        !adminPages.includes(pathname) &&
        !/^\/admin\/election\/\d+$/.test(pathname)
      ) {
        navigate("/");
      }
    };
    isRoleChecked.current && onPathChange();
  }, [isAdmin, currentPath, navigate]);
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
