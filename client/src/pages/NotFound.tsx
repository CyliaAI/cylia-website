import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Layout showNavbar={true} showFooter={false}>
      <section className="min-h-screen w-full bg-[#121212] flex flex-col items-center justify-center overflow-hidden">
        <h1
          className="text-blue-400 font-bold text-center text-6xl md:text-7xl lg:text-[100px] mt-20 mb-4 drop-shadow-[0_0_20px_rgba(0,0,255,0.5)]"
        >
          4 0 4
        </h1>
        <p className="text-gray-400 text-center text-lg md:text-xl mb-6">
          The page you’re looking for does not exist.
        </p>
        <button
          className="px-6 py-3 text-lg md:text-xl rounded-lg bg-blue-500 text-white hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(0,0,255,0.6)] transition-all duration-300"
          onClick={() => navigate("/workspace")}
        >
          Go to Home
        </button>
      </section>
    </Layout>
  );
};

export default NotFound;
