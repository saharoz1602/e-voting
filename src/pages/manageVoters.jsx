import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { usePublicClient, useWriteContract } from "wagmi";
import { PagePath } from "../components/pagePath";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";
import { shortenAddress } from "../lib/address";
import { useVotersContext } from "../context/votersContext";

export const ManageVoters = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { getVoters, voters } = useVotersContext();

  const onRegisterVoter = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const account = form.get("account");
    const action = new Promise(async (resolve, reject) => {
      try {
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "registerVoter",
          args: [account],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });

        getVoters();

        resolve(null);
      } catch (err) {
        reject(err.shortMessage || err.message);
      }
    });

    toast.promise(action, {
      loading: "Please accept tx in wallet and wait",
      success: "Registered voter successfully",
      error: (err) => err,
    });
  };

  useEffect(() => {
    getVoters();
  }, [getVoters]);

  return (
    <section>
      <PagePath />

      <div className="mb-10 flex justify-end">
        <form onSubmit={onRegisterVoter}>
          <input
            required
            name="account"
            className="border p-2 rounded-s-md outline-none focus:border-indigo-600 border-e-0 transition-all"
            placeholder="Wallet address"
          />

          <button
            type="submit"
            className="text-white border border-indigo-600 bg-indigo-600 p-2 rounded-e-md"
          >
            Add Voter
          </button>
        </form>
      </div>
      <div className="flex p-6 bg-gray-50 rounded-md">
        <h2 className="basis-1/4 text-xl font-medium">id</h2>
        <h2 className="basis-3/4 text-xl font-medium">Account</h2>
      </div>

      <div>
        {voters.map((voter, idx) => (
          <div className="flex py-4 px-6 even:bg-gray-50 rounded-md" key={idx}>
            <p className="basis-1/4">{idx + 1}</p>
            <p className="basis-3/4">{shortenAddress(voter.account)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
