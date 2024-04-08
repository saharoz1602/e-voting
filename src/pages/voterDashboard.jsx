import { Link } from "react-router-dom";
import { PagePath } from "../components/pagePath";
import { useElectionsContext } from "../context/electionsContext";
import { shortenAddress } from "../lib/address";
import { keccak256, toBytes } from "viem";
import { ELECTION_STAGES } from "../lib/constants";
import { useEffect } from "react";

export const VoterDashboard = () => {
  const { getElections, elections } = useElectionsContext();

  useEffect(() => {
    getElections();
  }, [getElections]);
  return (
    <section>
      <PagePath />

      <div className="flex p-6 bg-gray-50 rounded-md">
        <h2 className="basis-1/3 text-xl font-medium">Election Id</h2>
        <h2 className="basis-1/3 text-xl font-medium">Election Name</h2>
        <h2 className="basis-1/3 text-xl font-medium">Stage</h2>
      </div>

      <div>
        {elections.map((election, idx) => (
          <Link
            to={`/voter/election/${election.id}`}
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
