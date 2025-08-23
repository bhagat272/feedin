import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchResponses, clearResponses } from "../redux/reducers/responseSlice";
import axios from "axios";

const ResponsesPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const dispatch = useDispatch<any>();
  const { responses, loading, error } = useSelector((state: any) => state.responses);
  const [form, setForm] = useState<any>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // Fetch form to get original question texts
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/forms/${formId}`);
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
          `"${new Date(resp.submittedAt).toLocaleString()}"`
        ].join(",")
      )
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
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Responses</h2>

      <button
        onClick={exportCSV}
        className="mb-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Export as CSV
      </button>

      {responses.length === 0 ? (
        <p className="text-center text-gray-500">No responses yet.</p>
      ) : (
        <ul className="space-y-4">
          {responses.map((res: any, idx: number) => (
            <li
              key={idx}
              className="p-4 border rounded-xl shadow-lg bg-white hover:shadow-2xl transition cursor-pointer"
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Response #{idx + 1}</h3>
                <span className="text-gray-400 text-sm">
                  {new Date(res.submittedAt).toLocaleString()}
                </span>
              </div>

              {expandedIdx === idx && (
                <div className="mt-4 space-y-2">
                  {form.questions.map((q: any) => {
                    const ans = res.answers.find((a: any) => a.questionId === q._id);
                    return (
                      <p key={q._id}>
                        <strong className="text-gray-700">{q.text}:</strong>{" "}
                        <span className="text-gray-900">{ans ? ans.answer : "No answer"}</span>
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
  );
};

export default ResponsesPage;
