import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

interface PopupTeamProps {
  onClose: () => void;
}

export const PersonalPopUp: React.FC<PopupTeamProps> = ({ onClose }) => {
  const [name, setname] = useState("");
  const [Desc, setDesc] = useState("");
  const {id} = useContext(GlobalContext);
  const handleSave = async() => {
    try{
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/workspaces/create-personal-workspace`,{name:name,description:Desc,userId:id},{withCredentials:true})
        onClose();
        window.location.reload();
    }
    catch(err){
        console.log(err);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      <div className="fixed top-1/2 left-1/2 z-50 w-96 bg-gray-800 p-6 rounded-2xl shadow-xl -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-xl font-bold text-white mb-4">Create New Workspace</h2>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Workspace Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter team name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Workspace Description</label>
          <textarea
            value={Desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter description"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white py-1 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-indigo-500 cursor-pointer hover:bg-indigo-600 text-white py-1 px-4 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};
