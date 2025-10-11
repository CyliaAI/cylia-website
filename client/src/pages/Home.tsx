import {useContext} from "react";
import Layout from "../components/Layout/Layout";
import { GlobalContext } from "../context/GlobalContext";
import PrivateRoute from "@/router/PrivateRoutes";



const Home = () => {
    const {name} = useContext(GlobalContext);

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
          </div>
      </Layout>
    );
};

export default Home;
