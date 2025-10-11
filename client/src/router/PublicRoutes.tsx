import type { RouteObject } from "react-router-dom"
import NotFound from "../pages/NotFound"
import Home from "../pages/Home"
import Workspace from "../pages/Workspace"
import Login from "../pages/Login"
import CodeEditor from "../pages/codeEditor"

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
        path: "/login",
        element: <Login />,
        errorElement: <NotFound />,
    },
	{
		path:"/workspace/:id",
		element:<Workspace />,
		errorElement:<NotFound />
	},
	{
		path: "/code-editor",
		element: <CodeEditor />,
		errorElement: <NotFound />,
	},
	{
		path: "*",
		element: <NotFound />,
	},
]