import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RouterPath } from './path';
import { Layout } from '@/components/Layout';
import { MainPage } from '@/pages/Main';
import MyPage from '@/pages/Mypage';
import Login from '@/pages/Login'
import Directions from '@/pages/Directions';

const router = createBrowserRouter([
  {
    path: RouterPath.root,
    element: <Layout />,
    children: [
      { path: RouterPath.main, element: <MainPage /> }, 
      { path: RouterPath.mypage, element: <MyPage />},
      { path: RouterPath.login, element: <Login />},
      { path: RouterPath.directions, element: <Directions />}
    ],
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};