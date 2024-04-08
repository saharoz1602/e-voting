import { useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";

export const ElectoinWinner = ({ electionId, isEnded }) => {
  const publicClient = usePublicClient();
  const [winner, setWinner] = useState({});

  const getWinnerInfo = useCallback(
    async (electionId) => {
      try {
        const results = await publicClient.readContract({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "electionWinner",
          args: [electionId],
        });

        setWinner({
          name: results[0],
          party: results[1],
          candidateIdHash: results[2],
          votes: results[3],
          regId: results[4],
        });
        console.log(results);
      } catch (err) {}
    },
    [publicClient]
  );

  useEffect(() => {
    isEnded && getWinnerInfo(electionId);
  }, [getWinnerInfo, electionId, isEnded]);
  if (!isEnded) return null;
  return (
    <div className="bg-gray-50 rounded-md p-5 mt-10">
      <h2 className="text-xl font-medium mb-2">Election Winner</h2>
      <hr />

      <div className="mt-5 flex">
        <span className="basis-1/3">
          <p className="text-lg font-medium">Name</p>
          <p className="text-lg">{winner.name}</p>
        </span>
        <span className="basis-1/3">
          <p className="text-lg font-medium">Party</p>
          <p className="text-lg">{winner.party}</p>
        </span>
        <span className="basis-1/3">
          <p className="text-lg font-medium">Votes</p>
          <p className="text-lg">{parseInt(winner.votes)}</p>
        </span>
      </div>
    </div>
  );
};
