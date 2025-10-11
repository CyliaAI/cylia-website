import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { Viewteam } from "./Viewteam";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

const teams = [
  { name: "Team Alpha", members: 5, description: "Frontend & Backend Wizards" },
  { name: "Team Beta", members: 4, description: "AI & ML Enthusiasts" },
  { name: "Team Gamma", members: 6, description: "Design & UX Gurus" },
];

const personalProjects = [
  { name: "Project X", status: "In Progress" },
  { name: "AI Experiment", status: "Idle" },
  { name: "UI Revamp", status: "Completed" },
  { name: "Project X", status: "In Progress" },
  { name: "AI Experiment", status: "Idle" },
  { name: "UI Revamp", status: "Completed" },
];


const Home = () => {
  const [selectedTeam, setSelectedTeam] = useState<null | typeof teams[0]>(null);
  const {id} = useContext(GlobalContext);

  useEffect(()=>{
    const getTeams = async()=>{
      try{
        const teamDeatils = await axios.post("http://localhost:8000/workspaces/get",{userId:id},{withCredentials:true});
        console.log(teamDeatils);
      }
      catch(err){
        console.log(err);
      }
    }
    getTeams();
  },[])

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen text-white p-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Welcome, Name
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
                onClick={() => setSelectedTeam(team)} // ✅ select team on click
                className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 w-72 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-indigo-500/50"
              >
                <h3 className="text-xl font-semibold text-indigo-300 mb-2">
                  {team.name}
                </h3>
                <p className="text-gray-400 mb-4">{team.description}</p>
                <p className="text-gray-300 font-medium">
                  Members: {team.members}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 mt-10">
          <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
            Personal Workspace
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {personalProjects.map((project, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-700 p-6 w-72 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300 hover:shadow-pink-500/50"
              >
                <h3 className="text-xl font-semibold text-pink-300 mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-400 mb-2">Status: {project.status}</p>
                <button className="mt-2 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-4 rounded">
                  Open
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedTeam && (
          <Viewteam team={selectedTeam} onClose={() => setSelectedTeam(null)} />
        )}
      </div>
    </Layout>
  );
};

export default Home;
