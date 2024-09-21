import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RouterPath } from "./path";
import { Layout } from "@/components/Layout";
import { MainPage } from "@/pages/Main";
import MyPage from "@/pages/Mypage";
import Directions from "@/pages/Directions";

const router = createBrowserRouter([
  // Routes with Layout
  {
    path: RouterPath.root,
    element: <Layout />,
    children: [
      { path: RouterPath.main, element: <MainPage /> },
      { path: RouterPath.mypage, element: <MyPage /> },
      { path: RouterPath.directions, element: <Directions /> },
    ],
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
