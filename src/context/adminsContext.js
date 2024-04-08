import { createContext, useCallback, useContext, useState } from "react";
import { decodeEventLog, parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";

const AdminsContext = createContext({
  roles: [],
  getAdminLogs: () => Promise.resolve(),
});
export const AdminsContextProvider = ({ children }) => {
  const publicClient = usePublicClient();

  const [roles, setRoles] = useState([]);

  const getAdminLogs = useCallback(async () => {
    try {
      publicClient
        .getLogs({
          address: Evoting_Address,
          event: parseAbiItem(
            "event RoleGranted(bytes32 indexed, address indexed, address indexed)"
          ),
          fromBlock: 0n,
        })
        .then((logs) => {
          const decodeLogs = logs.map((log) => {
            const topics = decodeEventLog({
              abi: Evoting_ABI,
              ...log,
            });

            return topics.args;
          });

          setRoles(decodeLogs);
        });
    } catch (err) {
      console.log(err);
    }
  }, [publicClient]);

  return (
    <AdminsContext.Provider
      value={{
        roles,
        getAdminLogs,
      }}
    >
      {children}
    </AdminsContext.Provider>
  );
};

export const useAdminContext = () => useContext(AdminsContext);
