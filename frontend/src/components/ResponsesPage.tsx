import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchResponses,
  clearResponses,
} from "../redux/reducers/responseSlice";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const ResponsesPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch<any>();
  const { responses, loading, error } = useSelector(
    (state: any) => state.responses
  );
  const [form, setForm] = useState<any>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const navigate = useNavigate();

  // Fetch form to get original question texts
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/forms/${formId}`
        );
        setForm(res.data);
      } catch (err: any) {
        console.error("Failed to fetch form:", err);
      }
    };

    if (formId) fetchForm();
  }, [formId]);

  useEffect(() => {
    if (formId) {
      dispatch(fetchResponses(formId));
    }

    return () => {
      dispatch(clearResponses());
    };
  }, [dispatch, formId]);

  if (loading) return <p className="text-center mt-6">Loading responses...</p>;
  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;

  const exportCSV = () => {
    if (!responses || responses.length === 0 || !form) return;

    const headers = form.questions.map((q: any) => q.text);
    headers.push("Submitted At");

    const csvRows = [
      headers.join(","),
      ...responses.map((resp: any) =>
        [
          ...form.questions.map((q: any) => {
            const ans = resp.answers.find((a: any) => a.questionId === q._id);
            return `"${ans ? ans.answer.replace(/"/g, '""') : ""}"`;
          }),
          `"${new Date(resp.submittedAt).toLocaleString()}"`,
        ].join(",")
      ),
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `responses-${formId}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <div className="p-6 max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)} // 👈 or navigate('/dashboard')
          className="group flex items-center gap-2 mb-6 px-4 py-2 rounded-xl 
                   bg-gradient-to-r from-green-500 to-green-600 text-white font-medium 
                   shadow-md hover:shadow-lg hover:scale-105 active:scale-95 
                   transition-all duration-200"
        >
          <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
          Back
        </button>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center sm:text-left">
            Responses
          </h2>

          <button
            onClick={exportCSV}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md 
               hover:bg-blue-700 hover:shadow-lg transition-all"
          >
            Export as CSV
          </button>
        </div>

        {responses.length === 0 ? (
          <p className="text-center text-gray-500">No responses yet.</p>
        ) : (
          <ul className="space-y-4">
            {responses.map((res: any, idx: number) => (
              <li
                key={idx}
                className="p-4  shadow-xl hover:shadow-2xl rounded-xl shadow-lg bg-white hover:shadow-2xl transition cursor-pointer"
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    Response #{idx + 1}
                  </h3>
                  <span className="text-gray-400 text-sm">
                    {new Date(res.submittedAt).toLocaleString()}
                  </span>
                </div>

                {expandedIdx === idx && (
                  <div className="mt-4 space-y-2">
                    {form.questions.map((q: any) => {
                      const ans = res.answers.find(
                        (a: any) => a.questionId === q._id
                      );
                      return (
                        <p key={q._id}>
                          <strong className="text-gray-700">{q.text}:</strong>{" "}
                          <span className="text-gray-900">
                            {ans ? ans.answer : "No answer"}
                          </span>
                        </p>
                      );
                    })}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResponsesPage;
