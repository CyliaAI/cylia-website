import Layout from "../components/Layout/Layout"

const NotFound = () => {
	return (
		<Layout showNavbar={true} showFooter={false}>
			<section className="h-auto min-h-screen w-full bg-[#121212] relative overflow-hidden">
				<div className="flex flex-col items-center justify-center h-full">
					<h1	className={`text-blue-400 tex font-bold text-center text-6xl md:text-7xl lg:text-[100px] mt-20 mb-4 text-shadow-[0px_0px_20px_rgba(0,0,255,0.5)]`}>
						4 0 4
					</h1>
					<p className="text-gray-400 text-center text-lg md:text-xl">
						The page you’re looking for does not exist.
					</p>
				</div>
			</section>
		</Layout>
	)
}

export default NotFound