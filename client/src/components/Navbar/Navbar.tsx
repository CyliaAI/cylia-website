import axios from "axios";
import { redirect } from "react-router-dom";
import { PopupTeam } from "../../pages/PopupTeam.tsx";
import { useState } from "react";

const Navbar = () => {
  const [click, setClick] = useState(false);

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/auth/logout', {});
      redirect('/login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center px-10 py-4 bg-indigo-500">
        <div className="font-bold text-white text-3xl">Cylia</div>
        <div className="flex items-center gap-5">
          <div
            onClick={() => setClick(true)}
            className="bg-[#0d0367] px-3 py-2 rounded-sm text-white cursor-pointer font-bold"
          >
            Create Team
          </div>
          <div
            onClick={logout}
            className="bg-[#0d0367] px-3 py-2 rounded-sm text-white cursor-pointer font-bold"
          >
            Log Out
          </div>
        </div>
      </div>

      {click && <PopupTeam onClose={() => setClick(false)} />}
    </div>
  );
};

export default Navbar;

