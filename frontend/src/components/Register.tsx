import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { register } from "../redux/reducers/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/banner.png"; // ✅ same logo as login

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch<any>(
        register({ name, email, password })
      ).unwrap();

      toast.success(response?.message || "✅ Registration successful!", {
        position: "top-right",
        autoClose: 3000,
      });

         navigate("/dashboard");
     } catch (err: any) {
      toast.error(err || "⚠️ Something went wrong. Please try again.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* ✅ Logo above title (same as Login page) */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logo}
            alt="App Logo"
            className="w-52 h-auto mb-2 hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          <h2 className="text-2xl font-bold text-gray-800">Admin Register</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="new-password"
          />
          </div>

          {/* Submit Button with Loading Spinner */}  
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 p-3 rounded-lg text-white transition duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
