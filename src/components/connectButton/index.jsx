import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { toHex } from "viem";

// Components
import { FaWallet } from "react-icons/fa";

import { shortenAddress } from "@/src/lib/address";
import { switchNetwork } from "@/src/lib/switchNetwork";
import { chains } from "@/src/configs/web3Modal";

export const ConnectButton = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected, chain } = useAccount();
  const { data: walletProvider } = useWalletClient();

  const [{ isCorrectChain }, setState] = useState({
    isCorrectChain: true,
  });

  useEffect(() => {
    if (isConnected)
      setState({
        isCorrectChain: chain?.id === parseInt(chains[0].id),
      });
  }, [chain, isConnected]);

  const onChainChanged = async () => {
    try {
      await switchNetwork(walletProvider, {
        ...chains[0],
        chainId: toHex(chains[0].id),
      });
    } catch (err) {}
  };

  return (
    <>
      {isCorrectChain && (
        <button
          onClick={() => open()}
          className="w-full p-3 text-white bg-indigo-600 rounded-md"
        >
          {shortenAddress(address) || (
            <span className="text-base font-normal inline-flex justify-center items-center gap-5">
              Connect Wallet <FaWallet />
            </span>
          )}
        </button>
      )}

      {!isCorrectChain && (
        <button
          type="button"
          onClick={onChainChanged}
          className="w-full p-3 text-white bg-red-600 rounded-md"
        >
          <span className="capitalize">Wrong Network</span>
        </button>
      )}
    </>
  );
};
