import React, { useState } from "react";
import { useGlobalContext } from "@/context/GlobalContext";

interface NavbarProps {
  account: { name: string };
  isOnline?: boolean;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [ dropdown, setDropdown ] = useState(false);
  const { name } = useGlobalContext();
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

          <div className="flex items-center space-x-3">
            <span className="text-white/80 text-sm">{name}</span>
            <div onClick={() => setDropdown(!dropdown)} className="w-8 h-8 cursor-pointer bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <span className="text-white text-sm font-medium">
                {name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
