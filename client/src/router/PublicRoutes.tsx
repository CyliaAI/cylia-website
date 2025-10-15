import type { RouteObject } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import Workspace from '../pages/Workspace';
import Login from '../pages/Login';
import { ListWorkspace } from '@/pages/ListWorkspace';
import CodeEditor from '../pages/CodeEditor';

export const publicRoutes: RouteObject[] = [
  // {
  // 	path: "/clusters",
  // 	element: <Clusters />,
  // 	errorElement: <NotFound />,
  // },
  {
    path: '/',
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: '/workspace/:workspaceId',
    element: <Workspace type="personal" />,
    errorElement: <NotFound />,
  },
  {
    path: '/workspace/team/:workspaceId',
    element: <Workspace type="team" />,
    errorElement: <NotFound />,
  },
  {
    path: '/workspace',
    element: <ListWorkspace />,
    errorElement: <NotFound />,
  },
  {
    path: '/code-editor',
    element: <CodeEditor />,
    errorElement: <NotFound />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
