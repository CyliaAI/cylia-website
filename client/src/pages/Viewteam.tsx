import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { GlobalContext } from "../context/GlobalContext";
import { useContext } from "react";


interface ViewteamProps {
  team: {
    name: string;
    description: string;
    members: number;
  };
  onClose: () => void;
}

export const Viewteam: React.FC<ViewteamProps> = ({ team, onClose }) => {
  const [search, setSearch] = useState("");               
  const [debouncedSearch] = useDebounce(search, 500);   
  const [userResult, setUserResult] = useState<any>(null); 
  const {id} = useContext(GlobalContext);


  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setUserResult(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.post('http://localhost:8000/workspaces/get',{userId:id},{withCredentials:true});
        setUserResult(res.data);
      } catch (err) {
        console.error(err);
        setUserResult(null);
      }
    };

    fetchUser();
  }, [debouncedSearch]);

  const handleAddMember = () => {
    if (!userResult) return;
    alert(`Adding member: ${userResult.name} to team ${team.name}`);
    setSearch("");
    setUserResult(null);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      <div className="fixed top-1/2 left-1/2 z-50 w-96 bg-gray-800 p-6 rounded-2xl shadow-xl -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-2xl font-bold text-indigo-300 mb-2">{team.name}</h2>
        <p className="text-gray-400 mb-4">{team.description}</p>
        <p className="text-gray-300 font-medium mb-4">
          Members: {team.members}
        </p>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Add Member</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type user ID or name"
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {userResult && (
            <div className="mt-2 p-2 bg-gray-700 rounded text-gray-200">
              {userResult.name} ({userResult.email})
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded"
          >
            Close
          </button>

          <button
            onClick={handleAddMember}
            disabled={!userResult}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Member
          </button>
        </div>
      </div>
    </>
  );
};
