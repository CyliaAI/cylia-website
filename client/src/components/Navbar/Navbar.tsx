import React, { useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [ dropdown, setDropdown ] = useState(false);
  const { name, isLoggedIn } = useGlobalContext();

  const logout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`,{},{withCredentials:true});
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const viewspace = ()=>{
    navigate('/workspace')
  }

  return (
    <nav
      className={`fixed w-full px-10 py-4 z-50 transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-green-600">C</span>ylia
          </h1>
        </div>

        <div className="flex items-center space-x-6">

          {isLoggedIn && <div className="flex items-center space-x-3">
            <span className="text-white/80 text-sm">{name}</span>
            <div onClick={() => setDropdown(!dropdown)} className="w-8 h-8 cursor-pointer bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <span className="text-white text-sm font-medium">
                {name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>}
          {!isLoggedIn && (
            <div className="flex gap-3">
              <button className="">Login</button>
              <button className="">Register Now</button>
            </div>
          )}
        </div>
      </div>
      {dropdown && (
          <div className="absolute right-10 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 z-50">
            <ul className="flex flex-col">
              <li onClick={viewspace} className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white text-sm">View Workspace</li>
              <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white text-sm">Notifications</li>
              <li onClick={logout} className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-500 text-sm">Logout</li>
            </ul>
          </div>
      )}

    </nav>
    
  );
};

export default Navbar;
