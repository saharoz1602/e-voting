import { usePublicClient } from "wagmi";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";

const { createContext, useContext, useState, useCallback } = require("react");

const VotersContext = createContext({
  voters: [],
  getVoters: () => Promise.resolve(),
});

export const VotersContextProvider = ({ children }) => {
  const [voters, setVoters] = useState([]);
  const publicClient = usePublicClient();

  const getVoters = useCallback(async () => {
    try {
      const results = await publicClient.readContract({
        abi: Evoting_ABI,
        address: Evoting_Address,
        functionName: "getVoters",
      });

      setVoters(results);
    } catch (err) {}
  }, [publicClient]);

  return (
    <VotersContext.Provider
      value={{
        voters,
        getVoters,
      }}
    >
      {children}
    </VotersContext.Provider>
  );
};

export const useVotersContext = () => useContext(VotersContext);
