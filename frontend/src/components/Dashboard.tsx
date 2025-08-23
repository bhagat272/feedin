import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/reducers/authSlice";
import { fetchForms } from "../redux/reducers/formSlice";
import { FaEye, FaFileCsv, FaPlus, FaSignOutAlt } from "react-icons/fa";

const Dashboard: React.FC = () => {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [summary, setSummary] = useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const { token } = useSelector((state: any) => state.auth);
  const { forms, loading, error } = useSelector((state: any) => state.forms);
  const normalizedForms = Array.isArray(forms) ? forms : forms ? [forms] : [];

console.log("Current forms state:", forms);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    console.log("Fetching forms with token:", token);
    dispatch(fetchForms(token))
      .unwrap()
      .then((data:any) => console.log("Fetched forms:", data))
      .catch((err:Error) => console.error("Fetch error:", err));
  }, [token, navigate, dispatch]);

  const viewResponses = (formId: string) => {
    setSelectedForm(formId);

    const dummyResponses = [
      {
        _id: "resp1",
        submittedAt: new Date(),
        answers: [
          { questionId: "q1", answer: "Very Satisfied" },
          { questionId: "q2", answer: "Yes" },
        ],
      },
      {
        _id: "resp2",
        submittedAt: new Date(),
        answers: [
          { questionId: "q1", answer: "Neutral" },
          { questionId: "q2", answer: "Maybe" },
        ],
      },
    ];

    const dummySummary = [
      {
        answers: [
          { answer: "Very Satisfied", count: 1 },
          { answer: "Neutral", count: 1 },
        ],
      },
      {
        answers: [
          { answer: "Yes", count: 1 },
          { answer: "Maybe", count: 1 },
        ],
      },
    ];

    setResponses(dummyResponses);
    setSummary(dummySummary);
  };

  const exportCSV = (formId: string) => {
    alert(`CSV export for form ${formId} (mocked)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center drop-shadow-md">
          Dashboard
        </h2>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button
            onClick={() => navigate("/create-form")}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg hover:bg-green-700 transform hover:scale-105 transition duration-300"
          >
            <FaPlus /> Create Form
          </button>
          <button
            onClick={() => dispatch(logout())}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg hover:bg-red-700 transform hover:scale-105 transition duration-300"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Forms List */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Your Forms</h3>
        {loading && <p className="text-gray-500 text-center">Loading forms...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {normalizedForms.length === 0 && !loading && !error && (
          <p className="text-gray-500 text-center">No forms created yet.</p>
        )}

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {normalizedForms.map((form: any) => (
            <li
              key={form._id}
              className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                  <span className="font-bold text-lg text-gray-900">{form.title}</span>
                  <p className="text-gray-500 mt-1 text-sm">
                    Public URL:{' '}
                    <a
                      href={`${window.location.origin}/form/${form._id}`}
                      // target="_blank"
                      // rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/form/${form._id}`);
                        console.log("Navigating to:", `/form/${form._id}`);
                      }}
                    >
                      {window.location.origin}/form/{form._id}
                    </a>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => viewResponses(form._id)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                  >
                    <FaEye /> View Responses
                  </button>
                  <button
                    onClick={() => exportCSV(form._id)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
                  >
                    <FaFileCsv /> Export CSV
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Responses & Summary */}
        {selectedForm && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Responses</h3>
            <div className="overflow-x-auto rounded-2xl shadow-lg">
              <table className="w-full table-auto bg-white rounded-2xl">
                <thead className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <tr>
                    <th className="p-3 text-left">Submitted At</th>
                    {normalizedForms
                      .find((f: any) => f._id === selectedForm)
                      ?.questions.map((q: any) => (
                        <th key={q._id} className="p-3 text-left">
                          {q.text}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {responses.map((resp) => (
                    <tr key={resp._id} className="border-t hover:bg-gray-50 transition">
                      <td className="p-3">{new Date(resp.submittedAt).toLocaleString()}</td>
                      {resp.answers.map((ans: any) => (
                        <td key={ans.questionId} className="p-3">
                          {ans.answer}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <h3 className="text-2xl font-semibold text-gray-800 mt-12 mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {summary.map((qSum: any, i: number) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300"
                >
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    {normalizedForms.find((f: any) => f._id === selectedForm)?.questions[i].text}
                  </h4>
                  <ul className="list-disc pl-5">
                    {qSum.answers.map((a: any) => (
                      <li key={a.answer} className="text-gray-700">
                        {a.answer}: <span className="font-semibold">{a.count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;