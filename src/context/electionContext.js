import { createContext, useCallback, useContext, useState } from "react";
import { usePublicClient } from "wagmi";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";

const ElectionContext = createContext({
  electionInfo: {},
  candidates: [],
  getElectionInfo: () => Promise.resolve(),
});

export const ElectionContextProvider = ({ children }) => {
  const publicClient = usePublicClient();

  const [{ electionInfo, candidates }, setState] = useState({
    candidates: [],
    electionInfo: {},
  });

  const getElectionInfo = useCallback(
    async (electionId) => {
      try {
        const [electionInfo, candidates] = await Promise.all([
          publicClient.readContract({
            abi: Evoting_ABI,
            address: Evoting_Address,
            functionName: "getElectionById",
            args: [electionId],
          }),
          publicClient.readContract({
            abi: Evoting_ABI,
            address: Evoting_Address,
            functionName: "getElectionCandidates",
            args: [electionId],
          }),
        ]);

        setState({
          electionInfo,
          candidates,
        });
      } catch (err) {}
    },
    [publicClient]
  );

  return (
    <ElectionContext.Provider
      value={{
        electionInfo,
        candidates,
        getElectionInfo,
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
};

export const useElectionContext = () => useContext(ElectionContext);
