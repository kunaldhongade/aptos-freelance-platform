import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import { CreateCollection } from "@/pages/CreateCollection";
import { Mint } from "@/pages/Mint";
import { MyCollections } from "@/pages/MyCollections";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Mint />,
      },
      {
        path: "create-job",
        element: <CreateCollection />,
      },
      {
        path: "apply-job",
        element: <MyCollections />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
