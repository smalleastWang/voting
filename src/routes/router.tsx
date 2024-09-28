import { Layout } from '@/layout/Layout';
import Home from '@/views/home/Home';
import { NoMatch } from '@/views/NoMatch';
import { RouteObject } from 'react-router-dom';



export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      }
    ]
  },
  {
    path: '*',
    element: <NoMatch />
  }
]