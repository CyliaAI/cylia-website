import type { RouteObject } from "react-router-dom"
import NotFound from "../pages/NotFound"
import Home from "../pages/Home"
import Workspace from "../pages/Workspace"

export const publicRoutes: RouteObject[] = [
	// {
	// 	path: "/clusters",
	// 	element: <Clusters />,
	// 	errorElement: <NotFound />,
	// },
    {
        path: "/",
        element: <Home />,
        errorElement: <NotFound />,
    },
	{
		path:"/workspace",
		element:<Workspace />,
		errorElement:<NotFound />
	},
	{
		path: "*",
		element: <NotFound />,
	},
]