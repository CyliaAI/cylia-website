import type { ReactNode } from "react"
import Footer from "../Footer/Footer"
import Navbar from "../Navbar/Navbar"

type LayoutProps = {
	children: ReactNode
	showNavbar?: boolean
	showFooter?: boolean
}

const Layout = ({
	children,
	showNavbar = true,
	showFooter = true,
}: LayoutProps) => {
	return (
		<div className="relative h-full w-full z-[100]">
			{showNavbar && <Navbar />}
			{children}
			{showFooter && <Footer />}
		</div>
	)
}

export default Layout