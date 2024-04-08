import { usePublicClient } from "wagmi";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";

const { createContext, useContext, useState, useCallback } = require("react");

const ElectionsContext = createContext({
  elections: [],
  getElections: () => Promise.resolve(),
});

export const ElectionsContextProvider = ({ children }) => {
  const publicClient = usePublicClient();

  const [elections, setElections] = useState([]);

  const getElections = useCallback(async () => {
    try {
      const results = await publicClient.readContract({
        abi: Evoting_ABI,
        address: Evoting_Address,
        functionName: "getElections",
      });

      setElections(results);
    } catch (err) {}
  }, [publicClient]);

  return (
    <ElectionsContext.Provider
      value={{
        elections,
        getElections,
      }}
    >
      {children}
    </ElectionsContext.Provider>
  );
};

export const useElectionsContext = () => useContext(ElectionsContext);
