import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { keccak256, toBytes } from "viem";
import { usePublicClient, useWriteContract } from "wagmi";
import { useElectionContext } from "../context/electionContext";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";
import { PagePath } from "../components/pagePath";
import { ELECTION_STAGES } from "../lib/constants";
import { shortenAddress } from "../lib/address";
import toast from "react-hot-toast";
import { ElectoinWinner } from "../components/electionWinner";

export const Election = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { getElectionInfo, electionInfo, candidates } = useElectionContext();

  const { id } = useParams();

  useEffect(() => {
    id && getElectionInfo(id);
  }, [id, getElectionInfo]);

  const onRegisterCandidate = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const name = form.get("name");
    const party = form.get("party");
    const candidateId = form.get("candidateId");

    const action = new Promise(async (resolve, reject) => {
      try {
        const candidateIdHash = keccak256(toBytes(candidateId));
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "registerCandidatesToElection",
          args: [name, party, candidateIdHash, id],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });
        getElectionInfo(id);

        resolve(null);
      } catch (err) {
        reject(err.shortMessage || err.message);
      }
    });

    toast.promise(action, {
      loading: "Please accept tx in wallet and wait",
      success: "Registered Candidates successfully",
      error: (err) => err,
    });
  };

  const onStartElection = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);

    const duration = form.get("duration");

    const action = new Promise(async (resolve, reject) => {
      try {
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "startElection",
          args: [duration, id],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });
        getElectionInfo(id);

        resolve(null);
      } catch (err) {
        reject(err.shortMessage || err.message);
      }
    });

    toast.promise(action, {
      loading: "Please accept tx in wallet and wait",
      success: "Election Started successfully",
      error: (err) => err,
    });
  };

  const onEndElection = () => {
    const action = new Promise(async (resolve, reject) => {
      try {
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "endElection",
          args: [id],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });
        getElectionInfo(id);

        resolve(null);
      } catch (err) {
        reject(err.shortMessage || err.message);
      }
    });

    toast.promise(action, {
      loading: "Please accept tx in wallet and wait",
      success: "Election Ended successfully",
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

        <div className="mt-10">
          {electionInfo.stage === 1 && (
            <div>
              <button
                onClick={onEndElection}
                className="text-white border border-indigo-600 bg-indigo-600 p-2 rounded-md disabled:bg-indigo-400"
              >
                End Election
              </button>
            </div>
          )}
          {electionInfo.stage === 0 && (
            <form onSubmit={onStartElection}>
              <input
                required
                name="duration"
                type="number"
                className="border p-2 rounded-s-md outline-none focus:border-indigo-600 border-e-0 transition-all"
                placeholder="Duration in seconds"
              />

              <button
                disabled={candidates.length === 0}
                type="submit"
                className="text-white border border-indigo-600 bg-indigo-600 p-2 rounded-e-md disabled:bg-indigo-400"
              >
                Start Election
              </button>
            </form>
          )}
        </div>
      </div>

      <ElectoinWinner electionId={id} isEnded={electionInfo.stage === 2} />

      {electionInfo.stage === 0 && (
        <div className="bg-gray-50 rounded-md p-5 mt-10">
          <form
            onSubmit={onRegisterCandidate}
            className="grid grid-cols-12 gap-5"
          >
            <span className="flex flex-col col-span-12 md:col-span-6">
              <label htmlFor="name">Candidate Name</label>
              <input
                id="name"
                required
                name="name"
                type="text"
                className="border p-2 rounded-md outline-none focus:border-indigo-600 transition-all"
                placeholder="Candidate Name"
              />
            </span>
            <span className="flex flex-col col-span-12 md:col-span-6">
              <label htmlFor="party">Party Name</label>
              <input
                id="party"
                required
                name="party"
                type="text"
                className="border p-2 rounded-md outline-none focus:border-indigo-600 transition-all"
                placeholder="Party Name"
              />
            </span>
            <span className="flex flex-col col-span-12 md:col-span-6">
              <label htmlFor="candidateId">Candidate Id</label>
              <input
                id="candidateId"
                required
                name="candidateId"
                type="text"
                className="border p-2 rounded-md outline-none focus:border-indigo-600 transition-all"
                placeholder="Candidate Id"
              />
            </span>
            <div className="col-span-12">
              <button
                disabled={electionInfo.stage !== 0}
                type="submit"
                className="text-white border border-indigo-600 bg-indigo-600 p-2 rounded-md disabled:bg-indigo-400"
              >
                Register Candidate
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="pb-10 mt-10">
        <div className="flex p-6 bg-gray-50 rounded-md">
          <h2 className="basis-1/3 text-xl font-medium">Candidate Id</h2>
          <h2 className="basis-1/3 text-xl font-medium">Registration Id </h2>
          <h2 className="basis-1/3 text-xl font-medium">Name</h2>
          <h2 className="basis-1/3 text-xl font-medium">Party</h2>
          <h2 className="basis-1/3 text-xl font-medium">Votes</h2>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
