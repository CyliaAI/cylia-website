import type React from "react";
import { createContext, useContext } from "react";

export type GlobalContextType = {
  isLoggedIn: boolean | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
  id: number | null;
  setId: React.Dispatch<React.SetStateAction<number | null>>;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  name: string | null;
  setName: React.Dispatch<React.SetStateAction<string | null>>;
};

const GlobalContextState: GlobalContextType = {
  isLoggedIn: null,
  setIsLoggedIn: () => {},
  id: null,
  setId: () => {},
  email: null,
  setEmail: () => {},
  name: null,
  setName: () => {},
};

export const GlobalContext = createContext<GlobalContextType>(GlobalContextState);

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
