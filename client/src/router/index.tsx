import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './PublicRoutes';

const routes: RouteObject[] = [];

routes.push(...publicRoutes);

const router = createBrowserRouter(routes);

export default router;
