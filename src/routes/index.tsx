import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RouterPath } from './path';
import { Layout } from '@/components/Layout';
import { MainPage } from '@/pages/Main';

const router = createBrowserRouter([
  {
    path: RouterPath.root,
    element: <Layout />,
    children: [
      { path: RouterPath.main, element: <MainPage /> }, 
    ],
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};