import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout/Layout";
import { ViewTeam } from "./ViewTeam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import PrivateRoute from "@/router/PrivateRoutes";
import { PersonalPopUp } from "./PersonalPopUp";
import { PopupTeam } from "./PopupTeam";

type Team = {
  name: string;
  description: string;
  members: Array<unknown>;
  workflow: unknown;
};

type PersonalWorkspace = {
  name: string;
  description: string;
};

export const ListWorkspace = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [personalWorkspaces, setPersonalWorkspaces] = useState<PersonalWorkspace[]>([]);
  const [clickPers, setClickPers] = useState(false);
  const [clickTeam, setClickTeam] = useState(false);

  const { id } = useContext(GlobalContext);

  useEffect(() => {
    const getTeams = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/workspaces/get`,
          { userId: id },
          { withCredentials: true }
        );
        setTeams(response.data.teams);
        setPersonalWorkspaces(response.data.personalWorkspaces);
      } catch (err) {
        console.log(err);
      }
    };
    getTeams();
  }, [id]);

  const viewWorkspace = (project: any) => {
    try {
      navigate(`/workspace/personal/${project.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const viewTeamWorkspace = (team: any) => {
    try {
    console.log(team)
      navigate(`/workspace/team/${team.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <PrivateRoute />
      <div className="bg-gray-900 min-h-screen pt-10 text-white p-6">

        <div className="mb-10">
          <h2 className="text-4xl font-bold text-purple-400 mb-6 text-center">
            Teams
          </h2>

          <div className="flex justify-start px-10 mb-4">
            <button
              onClick={() => setClickTeam(!clickTeam)}
              className="bg-green-500 px-10 mb-4 cursor-pointer font-bold hover:bg-green-600 text-white py-2 rounded shadow-md"
            >
              + Create Team
            </button>
          </div>

          <div className="flex flex-wrap px-10 justify-start gap-6">
            {teams.map((team, index) => (
              <div
                key={index}
                onClick={() => setSelectedTeam(team)}
                className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 w-72 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-indigo-500/50"
              >
                <h3 className="text-xl font-semibold text-indigo-300 mb-2">
                  {team.name}
                </h3>
                <p className="text-gray-400 mb-4">{team.description}</p>
                <p className="text-gray-300 font-medium">
                  Members: {team.members.length}
                </p>
                <div className="flex justify-end">
                <button
                  onClick={() => viewTeamWorkspace(team)}
                  className="mt-2 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-4 rounded"
                >
                  Open
                </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 mt-20">
          <h2 className="text-4xl font-bold text-purple-400 mb-6 text-center">
            Personal Workspace
          </h2>

          <div className="flex px-10 justify-start mb-4">
            <button
              onClick={() => setClickPers(!clickPers)}
              className="bg-green-500 mb-4 font-bold cursor-pointer hover:bg-green-600 text-white px-4 py-2 rounded shadow-md"
            >
              + Create Personal Workspace
            </button>
          </div>

          <div className="flex px-10 flex-wrap justify-start gap-6">
            {personalWorkspaces.map((project, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 w-72 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 hover:shadow-pink-500/50"
              >
                <h3 className="text-xl font-semibold text-pink-300 mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-400 mb-2">Status: {project.description}</p>

                <button
                  onClick={() => viewWorkspace(project)}
                  className="mt-2 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-4 rounded"
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>

        {clickPers && <PersonalPopUp onClose={() => setClickPers(false)} />}
        {clickTeam && <PopupTeam onClose={() => setClickTeam(false)} />}
        {selectedTeam && (
          <ViewTeam team={selectedTeam} onClose={() => setSelectedTeam(null)} />
        )}
      </div>
    </Layout>
  );
};
