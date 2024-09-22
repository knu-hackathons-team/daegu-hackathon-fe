import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RouterPath } from "./path";
import { Layout } from "@/components/Layout";
import MyPage from "@/pages/Mypage";
import Directions from "@/pages/Directions";

const router = createBrowserRouter([
  // Routes with Layout
  {
    path: RouterPath.root,
    element: <Layout />,
    children: [
      { path: RouterPath.main, element: <Directions /> },
      { path: RouterPath.mypage, element: <MyPage /> },
    ],
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
