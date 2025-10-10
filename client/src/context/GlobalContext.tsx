import type React from "react"
import { createContext, useContext } from "react"

export type User = object | undefined

type GlobalContextType = {
	userToken: string
	setUserToken: React.Dispatch<React.SetStateAction<string>>
	auth: boolean
	setAuth: React.Dispatch<React.SetStateAction<boolean>>
}

const GlobalContextState: GlobalContextType = {
	userToken: "",
	setUserToken: () => {},
	auth: false,
	setAuth: () => {},
}
export const GlobalContext =
	createContext<GlobalContextType>(GlobalContextState)

export const useGlobalContext = () => {
	return useContext(GlobalContext)
}