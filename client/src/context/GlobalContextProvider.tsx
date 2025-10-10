import React, { useEffect } from "react"
import { GlobalContext } from "./GlobalContext"

type containerProps = {
	children: React.ReactNode
}

export const GlobalContextProvider: React.FC<containerProps> = ({
	children,
}) => {
	const [userToken, setUserToken] = React.useState<string>("")
	const [auth, setAuth] = React.useState<boolean>(false)

	useEffect(() => {
		const userToken = localStorage.getItem("token")
		if (userToken) {
			setUserToken(userToken)
			setAuth(true)
		}
	}, [])

	return (
		<GlobalContext.Provider
			value={{ userToken, setUserToken, auth, setAuth }}>
			{children}
		</GlobalContext.Provider>
	)
}