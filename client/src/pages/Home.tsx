import { useEffect, useState, useContext } from "react";
import Layout from "../components/Layout/Layout";
import { ViewTeam } from "./ViewTeam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import PrivateRoute from "@/router/PrivateRoutes";
import { PersonalPopUp } from "./PersonalPopUp";

type Team = {
  name: string;
  description: string;
  members: Array<unknown>;
  workflow: unknown;
};

type personalWorkspace = {
  name: string;
  description: string;
};

const Home = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [personalWorkspaces, setPersonalWorkspaces] = useState<personalWorkspace[]>([]);
  const { id, name } = useContext(GlobalContext);
  const [clickPers,setClickPers] = useState(false);

  const viewWorkspace = (project:any)=>{
    try{
      navigate(`/workspace/${project.id}`);
    }
    catch(err){
      console.log(err);
    }
  }

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

  return (
    <Layout>
      <PrivateRoute />
      <div className="bg-gray-900 min-h-screen text-white p-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Welcome {name}
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your Teams, Projects, and AI Workflows
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
            Teams
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
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
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 mt-10">
          <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
            Personal Workspace
          </h2>

          <div className="flex justify-center mb-4">
            <button
              onClick={() => setClickPers(!clickPers)}
              className="bg-green-500 cursor-pointer hover:bg-green-600 text-white py-2 px-4 rounded shadow-md"
            >
              + Create Personal Workspace
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {personalWorkspaces.map((project, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 w-72 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 hover:shadow-pink-500/50"
              >
                <h3 className="text-xl font-semibold text-pink-300 mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-400 mb-2">Status: {project.description}</p>
             
                <button  onClick={()=>viewWorkspace(project)}  className="mt-2 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-4 rounded">
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>
        {clickPers && <PersonalPopUp onClose={() => setClickPers(false)}/>}
        {selectedTeam && (
          <ViewTeam team={selectedTeam} onClose={() => setSelectedTeam(null)} />
        )}
      </div>
    </Layout>
  );
};

export default Home;
