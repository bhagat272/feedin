import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const FeedbackSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <CheckCircleIcon className="w-24 h-24 text-green-600 mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Feedback Submitted!
      </h2>
      <p className="text-gray-600 mb-6">
        Thank you for sharing your feedback.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default FeedbackSuccess;
