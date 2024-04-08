import { createWeb3Modal } from "@web3modal/wagmi/react";
import { localhost } from "viem/chains";
import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

//  Get projectId
const projectId = "3828bedc82f5ba0e923c413da3250b1a";

export const chains = [{ ...localhost, id: 31337 }];

export const wagmiConfig = createConfig({
  chains: chains,
  transports: {
    [chains[0].id]: http(),
  },
  connectors: [injected({ shimDisconnect: true })],
});
// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: "light",
  themeVariables: {
    "--w3m-border-radius-master": "0.085rem",
  },
});
