import { useEffect } from "react";
import { PagePath } from "../components/pagePath";
import { useAdminContext } from "../context/adminsContext";
import { useVotersContext } from "../context/votersContext";
import { useElectionsContext } from "../context/electionsContext";
import { RiAdminFill } from "react-icons/ri";
import { GiVote } from "react-icons/gi";
import { MdHowToVote } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

export const AdminDashboard = () => {
  const { getAdminLogs, roles } = useAdminContext();
  const { getElections, elections } = useElectionsContext();
  const { getVoters, voters } = useVotersContext();

  useEffect(() => {
    getAdminLogs();
    getVoters();
    getElections();
  }, [getAdminLogs, getElections, getVoters]);

  return (
    <section>
      <PagePath />

      <div className="flex gap-5 flex-wrap md:flex-nowrap">
        <div className="basis-full md:basis-1/3 bg-gray-50 p-5 rounded-md">
          <h2 className="text-xl font-medium flex gap-2 items-center">
            <RiAdminFill />
            Admins
          </h2>

          <div className="flex justify-between items-center">
            <p className="mt-2 text-lg">{roles.length}</p>
            <Link to="/admin/manage-admins">
              <FaEye className="h-6 w-6 hover:text-indigo-600 transition-all" />
            </Link>
          </div>
        </div>
        <div className="basis-full md:basis-1/3 bg-gray-50 p-5 rounded-md">
          <h2 className="text-xl font-medium flex gap-2 items-center">
            <GiVote />
            Elections
          </h2>

          <div className="flex justify-between items-center">
            <p className="mt-2 text-lg">{elections.length}</p>
            <Link to="/admin/manage-elections">
              <FaEye className="h-6 w-6 hover:text-indigo-600 transition-all" />
            </Link>
          </div>
        </div>
        <div className="basis-full md:basis-1/3 bg-gray-50 p-5 rounded-md">
          <h2 className="text-xl font-medium flex gap-2 items-center">
            <MdHowToVote />
            Voters
          </h2>
          <div className="flex justify-between items-center">
            <p className="mt-2 text-lg">{voters.length}</p>
            <Link to="/admin/manage-voters">
              <FaEye className="h-6 w-6 hover:text-indigo-600 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
