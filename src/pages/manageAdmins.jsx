import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { usePublicClient, useWriteContract } from "wagmi";
import { PagePath } from "../components/pagePath";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";
import { shortenAddress } from "../lib/address";
import { ADMIN_ROLE } from "../lib/constants";
import { useAdminContext } from "../context/adminsContext";

const ROLES_TO_NAME = {
  "0x0000000000000000000000000000000000000000000000000000000000000000":
    "Super Admin",
  "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775": "Admin",
};

export const ManageAdmins = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { getAdminLogs, roles } = useAdminContext();

  const onGrantRole = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const account = form.get("account");
    const action = new Promise(async (resolve, reject) => {
      try {
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "grantRole",
          args: [ADMIN_ROLE, account],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });

        getAdminLogs();

        resolve(null);
      } catch (err) {
        reject(err.shortMessage || err.message);
      }
    });

    toast.promise(action, {
      loading: "Please accept tx in wallet and wait",
      success: "Role granted successfully",
      error: (err) => err,
    });
  };

  useEffect(() => {
    getAdminLogs();
  }, [getAdminLogs]);

  return (
    <section>
      <PagePath />

      <div className="mb-10 flex justify-end">
        <form onSubmit={onGrantRole}>
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
            Grant Role
          </button>
        </form>
      </div>
      <div className="flex p-6 bg-gray-50 rounded-md">
        <h2 className="basis-1/3 text-xl font-medium">Role</h2>
        <h2 className="basis-1/3 text-xl font-medium">Account</h2>
        <h2 className="basis-1/3 text-xl font-medium">Assigned By</h2>
      </div>

      <div>
        {roles.map((role, idx) => (
          <div className="flex py-4 px-6 even:bg-gray-50 rounded-md" key={idx}>
            <p className="basis-1/3">{ROLES_TO_NAME[role.role]}</p>
            <p className="basis-1/3">{shortenAddress(role.account)}</p>
            <p className="basis-1/3">{shortenAddress(role.sender)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
