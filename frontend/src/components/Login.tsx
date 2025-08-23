import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/reducers/authSlice'; // ✅ Adjust path
import { toast } from 'react-toastify'; // ✅ import toast
import { Link } from 'react-router-dom';
import logo from '../assets/banner.png'; // if stored in src/assets

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: any) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('⚠️ Please fill in all fields!', { position: 'top-right' });
      return;
    }
    try {
      const result = await dispatch<any>(login({ email, password }));
      if (result.payload?.token) {
        toast.success('✅ Login successful!', {
          position: 'top-right',
          autoClose: 2000,
        });
        navigate('/dashboard');
      } else if (error) {
        toast.error(`❌ ${error || 'Invalid credentials!'}`, { position: 'top-right' });
      }
    } catch (err) {
      console.error('Login exception:', err);
      toast.error('⚠️ An unexpected error occurred. Try again!', { position: 'top-right' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
        {/* App Logo with animation and welcoming message */}
        <div className="flex flex-col items-center mb-6 space-y-2">
          <img
            src={logo}
            alt="App Logo"
            className="w-52 h-auto mb-2 hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          <h2 className="text-3xl font-extrabold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back!
          </h2>
          <p className="text-sm text-gray-500">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
              autoComplete="email"
              aria-label="Email address"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              {/* <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:underline hover:text-blue-800 transition-colors duration-200"
              >
                Forgot Password?
              </Link> */}
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
              autoComplete="current-password"
              aria-label="Password"
            />
          </div>

          {/* Submit Button with Spinner */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
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
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : null}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center mt-6 text-gray-600">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;