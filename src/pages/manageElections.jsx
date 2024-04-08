import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { usePublicClient, useWriteContract } from "wagmi";
import { PagePath } from "../components/pagePath";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";
import { ELECTION_STAGES } from "../lib/constants";
import { keccak256, toBytes } from "viem";
import { shortenAddress } from "../lib/address";
import { useElectionsContext } from "../context/electionsContext";

export const ManageElections = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { getElections, elections } = useElectionsContext();

  const onCreateElection = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const election = form.get("election");

    const action = new Promise(async (resolve, reject) => {
      try {
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "createElection",
          args: [election],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });

        getElections();
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

  useEffect(() => {
    getElections();
  }, [getElections]);
  return (
    <section>
      <PagePath />

      <div className="mb-10 flex justify-end">
        <form onSubmit={onCreateElection}>
          <input
            required
            name="election"
            className="border p-2 rounded-s-md outline-none focus:border-indigo-600 border-e-0 transition-all"
            placeholder="Election Name"
          />

          <button
            type="submit"
            className="text-white border border-indigo-600 bg-indigo-600 p-2 rounded-e-md"
          >
            Create Election
          </button>
        </form>
      </div>
      <div className="flex p-6 bg-gray-50 rounded-md">
        <h2 className="basis-1/3 text-xl font-medium">Election Id</h2>
        <h2 className="basis-1/3 text-xl font-medium">Election Name</h2>
        <h2 className="basis-1/3 text-xl font-medium">Stage</h2>
      </div>

      <div>
        {elections.map((election, idx) => (
          <Link
            to={`/admin/election/${election.id}`}
            className="flex py-4 px-6 even:bg-gray-50 rounded-md hover:bg-gray-100"
            key={idx}
          >
            <p className="basis-1/3 underline">
              {shortenAddress(keccak256(toBytes(parseInt(election.id))))}
            </p>
            <p className="basis-1/3">{election.electionName}</p>
            <p className="basis-1/3">{ELECTION_STAGES[election.stage]}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};
