import React, { useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import type { GlobalContextType } from "./GlobalContext";
import axios from "axios";

type ContainerProps = {
  children: React.ReactNode;
};

export const GlobalContextProvider: React.FC<ContainerProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const resp = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/verify`, {
          withCredentials: true,
        });
        setIsLoggedIn(true);
        setId(resp.data.user.id || null);
        setEmail(resp.data.user.email || null);
        setName(resp.data.user.name || null);
      } 
	  catch (err) {
        console.error(err);
        setIsLoggedIn(false);
      }
    };
    verifyAuth();
  }, []);

  const contextValue: GlobalContextType = {
    isLoggedIn,
    setIsLoggedIn,
    id,
    setId,
    email,
    setEmail,
    name,
    setName,
  };

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
};
