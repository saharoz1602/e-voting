import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/src/configs/web3Modal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/src/configs/web3Modal";

import { Routes } from "./routes";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Routes />
        <Toaster position="top-center" />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
