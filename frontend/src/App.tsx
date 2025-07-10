import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from "react-router";
import Profile from "./Profile";
import Home from "./Home";
import About from "./About";
import Layout from "./Layout";

const myRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
];

export default function App() {
  return <RouterProvider router={createBrowserRouter(myRoutes)} />;
}
