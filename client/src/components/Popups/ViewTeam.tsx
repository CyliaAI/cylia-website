import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import { GlobalContext } from '../../context/GlobalContext';

interface ViewteamProps {
  team: {
    name: string;
    description: string;
    members: Array<any>;
    workflow: unknown;
  };
  onClose: () => void;
}

export const ViewTeam: React.FC<ViewteamProps> = ({ team, onClose }) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const teamId = team.members[0]?.teamId;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userResults, setUserResults] = useState<any>(null);
  const { id } = useContext(GlobalContext);

  useEffect(() => {
    if (debouncedSearch.trim() === '') {
      setUserResults([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/users/find`,
          { search: debouncedSearch },
          { withCredentials: true },
        );
        setUserResults(res.data.users || []);
      } catch (err) {
        console.error(err);
        setUserResults([]);
      }
    };

    fetchUsers();
  }, [id, debouncedSearch]);

  const handleAddMember = async (user: any) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/workspaces/add-team-member`,
        { teamId, userId: user.id },
        { withCredentials: true },
      );
    } catch (err) {}
    setSearch('');
    setUserResults([]);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>

      <div className="fixed top-1/2 left-1/2 z-50 w-96 bg-gray-800 p-6 rounded-2xl shadow-xl -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-2xl font-bold text-indigo-300 mb-2">{team.name}</h2>
        <p className="text-gray-400 mb-4">{team.description}</p>
        <p className="text-gray-300 font-medium mb-4">Members: {team.members.length || 0}</p>

        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Add Member</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type user ID or name"
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {debouncedSearch && userResults.length === 0 && (
            <div className="mt-2 text-gray-400 text-sm italic">No users found</div>
          )}

          {userResults && userResults.length > 0 && (
            <div className="mt-2 bg-gray-700 rounded divide-y divide-gray-600 max-h-48 overflow-y-auto">
              {userResults.map((user: any) => (
                <div
                  key={user.id}
                  className="p-2 hover:bg-gray-600 cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-200">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleAddMember(user)}
                    className="bg-indigo-500 cursor-pointer hover:bg-indigo-600 text-sm px-2 py-1 rounded"
                  >
                    Add
                  </button>
                </div>
              ))}
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
        </div>
      </div>
    </>
  );
};
