import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducers/authSlice";
import { fetchForms } from "../redux/reducers/formSlice";
import { FaCopy, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const { token } = useSelector((state: any) => state.auth);
  const { forms, loading, error } = useSelector((state: any) => state.forms);

  // Normalize forms array safely
  const normalizedForms =
    Array.isArray(forms) && forms.length > 0 ? forms[0].forms : [];

  useEffect(() => {
    if (!token) {
      navigate("/");

      return;
    }
    dispatch(fetchForms(token));
  }, [token, navigate, dispatch]);
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("URL copied to clipboard!", {
          position: "top-right",
          hideProgressBar: true,
          autoClose: 2000, // closes after 2s (you can adjust)
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((err) => console.error("Failed to copy:", err));
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center drop-shadow-md">
          Dashboard
        </h2>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-8 gap-4">
          <button
            onClick={() => navigate("/create-form")}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg hover:bg-green-700 transition duration-300"
          >
            <FaPlus /> Create Form
          </button>
          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg hover:bg-red-700 transition duration-300"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Forms List */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Feedback Forms
        </h3>
        {loading && (
          <p className="text-gray-500 text-center">Loading forms...</p>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {normalizedForms.length === 0 && !loading && !error && (
          <p className="text-gray-500 text-center">No forms created yet.</p>
        )}

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...normalizedForms] // create a copy to avoid mutating Redux state
            .sort((a: any, b: any) => a._id.localeCompare(b._id))
            .map((form: any) => (
              <li
                key={form._id}
                className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 cursor-pointer"
                onClick={() => navigate(`/form/${form._id}`)}
              >
                <span className="font-bold text-lg text-gray-900">
                  {form.title}
                </span>
                <p className="text-gray-500 mt-1 text-sm break-all">
                  Share URL:{" "}
                  <span
                    className="text-blue-600 underline cursor-pointer flex items-center"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigating on URL click
                      copyToClipboard(
                        `${window.location.origin}/form/${form._id}`
                      );
                    }}
                  >
                    {window.location.origin}/form/{form._id}
                    <FaCopy className="ml-1 text-blue-600" />
                  </span>
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent parent li navigation
                    navigate(`/response/${form._id}`);
                  }}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  View Responses
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
