import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { PagePath } from "../components/pagePath";
import { useElectionContext } from "../context/electionContext";
import { ELECTION_STAGES } from "../lib/constants";
import { shortenAddress } from "../lib/address";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";
import toast from "react-hot-toast";
import { ElectoinWinner } from "../components/electionWinner";

export const VoterElection = () => {
  const { id } = useParams();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const { getElectionInfo, electionInfo, candidates } = useElectionContext();
  const [voteStatus, setVoteStatus] = useState(true);

  const getVoteStatus = useCallback(
    async (address, electionId) => {
      try {
        const status = await publicClient.readContract({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "getVoterVoteStatus",
          args: [electionId, address],
        });
        setVoteStatus(status);
      } catch (err) {}
    },
    [publicClient]
  );

  useEffect(() => {
    id && getElectionInfo(id);
    id && address && getVoteStatus(address, id);
  }, [id, address, getElectionInfo, getVoteStatus]);

  const onVote = (candidateId) => {
    const action = new Promise(async (resolve, reject) => {
      try {
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "vote",
          args: [candidateId, id],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });

        getElectionInfo(id);
        getVoteStatus(address, id);
        resolve(null);
      } catch (err) {
        reject(err.shortMessage || err.message);
      }
    });

    toast.promise(action, {
      loading: "Please accept tx in wallet and wait",
      success: "Election created successfully",
      error: (err) => err,
    });
  };

  return (
    <section>
      <PagePath />

      <div className="bg-gray-50 rounded-md p-5">
        <div className="flex gap-10 flex-wrap">
          <span>
            <h2 className="text-xl font-medium">Election Name</h2>
            <p className="text-lg font-normal">{electionInfo.electionName}</p>
          </span>
          <span>
            <h2 className="text-xl font-medium">Election Stage</h2>
            <p className="text-lg font-normal">
              {ELECTION_STAGES[electionInfo.stage]}
            </p>
          </span>

          <span>
            <h2 className="text-xl font-medium">Candidates</h2>
            <p className="text-lg font-normal">{candidates.length}</p>
          </span>
          <span>
            <h2 className="text-xl font-medium">Ends At</h2>
            <p className="text-lg font-normal">
              {electionInfo.stage === 1 &&
                new Date(
                  parseInt(electionInfo.duration) * 1000
                ).toLocaleString()}
              {electionInfo.stage !== 1 && "N/A"}
            </p>
          </span>
        </div>
      </div>

      <ElectoinWinner electionId={id} isEnded={electionInfo.stage === 2} />

      <div className="my-10">
        <div className="flex p-6 bg-gray-50 rounded-md">
          <h2 className="basis-1/3 text-xl font-medium">Candidate Id</h2>
          <h2 className="basis-1/3 text-xl font-medium">Registration Id </h2>
          <h2 className="basis-1/3 text-xl font-medium">Name</h2>
          <h2 className="basis-1/3 text-xl font-medium">Party</h2>
          <h2 className="basis-1/3 text-xl font-medium">Votes</h2>
          <span className="basis-1/3 " />
        </div>

        <div>
          {candidates.map((candidate, idx) => (
            <div
              className="flex py-4 px-6 even:bg-gray-50 rounded-md"
              key={idx}
            >
              <p className="basis-1/3">
                {shortenAddress(candidate.candidateIdHash)}
              </p>
              <p className="basis-1/3">{parseInt(candidate.regId)} </p>
              <p className="basis-1/3">{candidate.name} </p>
              <p className="basis-1/3">{candidate.party}</p>
              <p className="basis-1/3">{parseInt(candidate.votes)}</p>
              <div className="basis-1/3">
                <button
                  onClick={onVote.bind(this, candidate.regId)}
                  disabled={voteStatus}
                  className="text-white border border-indigo-600 bg-indigo-600 px-6 py-1.5 rounded-md disabled:bg-indigo-400"
                >
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
