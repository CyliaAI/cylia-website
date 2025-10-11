import Layout from "../components/Layout/Layout";

const teams = [
  { name: "Team Alpha", members: 5, description: "Frontend & Backend Wizards" },
  { name: "Team Beta", members: 4, description: "AI & ML Enthusiasts" },
  { name: "Team Gamma", members: 6, description: "Design & UX Gurus" },
];

const Home = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-10 text-white bg-gray-900 min-h-screen p-6">
        <div className="text-center pt-10 text-3xl font-bold text-indigo-400">
          Dashboard
        </div>

        <div>
          <div className="text-2xl text-center font-bold text-purple-300 mb-6">
            Teams
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {teams.map((team, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-700 cursor-pointer shadow-xl rounded-2xl p-6 w-72 hover:scale-105 transition-transform duration-300 hover:shadow-indigo-500/30"
              >
                <h2 className="text-xl font-semibold mb-2 text-indigo-300">{team.name}</h2>
                <p className="text-gray-400 mb-4">{team.description}</p>
                <p className="text-gray-300 font-medium">Members: {team.members}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-2xl text-center font-bold text-purple-300 mb-6">
            Personal Workspace
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {teams.map((team, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-gray-700 cursor-pointer shadow-xl rounded-2xl p-6 w-72 hover:scale-105 transition-transform duration-300 hover:shadow-pink-500/30"
              >
                <h2 className="text-xl font-semibold mb-2 text-pink-300">{team.name}</h2>
                <p className="text-gray-400 mb-4">{team.description}</p>
                <p className="text-gray-300 font-medium">Members: {team.members}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
