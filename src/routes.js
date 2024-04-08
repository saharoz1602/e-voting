import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { PageLayout } from "@/src/layouts/pageLayout";
import { Home } from "@/src/pages/home";
import { VoterDashboard } from "@/src/pages/voterDashboard";
import { AdminDashboard } from "@/src/pages/adminDashboard";
import { VoterLayout } from "./layouts/voterLayout";
import { AdminLayout } from "./layouts/adminLayout";
import { ManageAdmins } from "./pages/manageAdmins";
import { ManageVoters } from "./pages/manageVoters";
import { ManageElections } from "./pages/manageElections";
import { Election } from "./pages/election";
import { AdminsContextProvider } from "./context/adminsContext";
import { ElectionsContextProvider } from "./context/electionsContext";
import { VotersContextProvider } from "./context/votersContext";
import { ElectionContextProvider } from "./context/electionContext";
import { VoterElection } from "./pages/voterElection";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PageLayout>
        <Home />
      </PageLayout>
    ),
  },

  {
    path: "/admin",
    element: (
      <PageLayout>
        <AdminLayout>
          <Outlet />
        </AdminLayout>
      </PageLayout>
    ),

    children: [
      {
        path: "",
        element: (
          <AdminsContextProvider>
            <ElectionsContextProvider>
              <VotersContextProvider>
                <AdminDashboard />
              </VotersContextProvider>
            </ElectionsContextProvider>
          </AdminsContextProvider>
        ),
      },

      {
        path: "manage-admins",
        element: (
          <AdminsContextProvider>
            <ManageAdmins />
          </AdminsContextProvider>
        ),
      },
      {
        path: "manage-elections",
        element: (
          <ElectionsContextProvider>
            <ManageElections />
          </ElectionsContextProvider>
        ),
      },
      {
        path: "election/:id",
        element: (
          <ElectionContextProvider>
            <Election />
          </ElectionContextProvider>
        ),
      },
      {
        path: "manage-voters",
        element: (
          <VotersContextProvider>
            <ManageVoters />
          </VotersContextProvider>
        ),
      },
    ],
  },

  {
    path: "/voter",
    element: (
      <PageLayout>
        <VoterLayout>
          <Outlet />
        </VoterLayout>
      </PageLayout>
    ),
    children: [
      {
        path: "",
        element: (
          <ElectionsContextProvider>
            <VoterDashboard />
          </ElectionsContextProvider>
        ),
      },
      {
        path: "election/:id",
        element: (
          <ElectionContextProvider>
            <VoterElection />
          </ElectionContextProvider>
        ),
      },
    ],
  },
]);
export const Routes = () => {
  return <RouterProvider router={router} />;
};
