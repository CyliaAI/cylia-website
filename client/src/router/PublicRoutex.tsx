import type { RouteObject } from "react-router-dom"
import NotFound from "../pages/NotFound"
import Home from "../pages/Home"

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
		path: "*",
		element: <NotFound />,
	},
]