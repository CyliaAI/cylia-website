import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { Toaster } from "react-hot-toast"
import { RouterProvider } from "react-router-dom"
import { GlobalContextProvider } from "./context/GlobalContextProvider"
import router from "./router"

const rootElement = document.getElementById("root")
if (!rootElement) {
	throw new Error("Root element not found")
}

createRoot(rootElement).render(
	<StrictMode>
		<GlobalContextProvider>
			<RouterProvider router={router} />
			<Toaster />
		</GlobalContextProvider>
	</StrictMode>,
)