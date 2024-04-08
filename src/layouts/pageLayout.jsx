import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, usePublicClient } from "wagmi";
import { ADMIN_ROLE } from "../lib/constants";
import { homePageConfig } from "../configs/homeConfg";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";

export const PageLayout = ({ children }) => {
  const navigate = useNavigate();
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const onWalletConnect = useCallback(
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

        navigate(path);
      } catch (err) {
        console.log(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [publicClient, navigate]
  );

  useEffect(() => {
    address && onWalletConnect(address);

    !address && navigate("/");
  }, [address, onWalletConnect, navigate]);

  return <main className="min-h-screen h-full flex flex-col">{children}</main>;
};
