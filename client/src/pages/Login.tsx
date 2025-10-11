import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-[#000000c0] p-8 rounded-xl shadow-md max-w-sm w-full text-center">
        <h1 className="text-2xl text-white font-bold mb-6">Login</h1>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white font-semibold rounded-lg hover:bg-gray-100 cursor-pointer transition"
        >
          <FcGoogle className="w-6 h-6" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
