import { useMediaQuery } from "react-responsive"

export const useDeviceBreakpoints = () => {
	const isMobilePortrait = useMediaQuery({
		maxWidth: 500,
	})

	const isMobileLandscape = useMediaQuery({
		maxWidth: 900,
		orientation: "landscape",
		maxHeight: 500,
	})

	const isTablet = useMediaQuery({
		query: "(max-width: 950px) and (min-width: 501px) and (min-height: 600px)",
	})

	const isDesktop = !isMobilePortrait && !isMobileLandscape && !isTablet

	return { isMobilePortrait, isMobileLandscape, isTablet, isDesktop }
}