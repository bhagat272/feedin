import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const FormSubmission: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
 
  const [form, setForm] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false); // ✅ track submit state

  // Fetch public form
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/forms/${id}`
        );
        setForm(res.data);
      } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.error || "Failed to fetch form");
      }
    };
    fetchForm();
  }, [id]);

  const handleChange = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // ✅ show loading

    const formattedAnswers = Object.keys(answers).map((key) => ({
      questionId: key,
      answer: answers[key].toString(),
    }));

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/responses/${id}`,
        { answers: formattedAnswers }
      );
      navigate("/feedback-success"); // ✅ redirect after success
    } catch (err: any) {
      toast.error(
        "Submission failed: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setLoading(false); // ✅ reset loading even if error
    }
  };

  if (!form)
    return <div className="text-center text-gray-600 mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {form.title}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.questions.map((q: any) => (
            <div key={q._id} className="space-y-2">
              <label className="block text-gray-700">{q.text}</label>
              {q.type === "text" ? (
                <input
                  type="text"
                  value={answers[q._id] || ""}
                  onChange={(e) => handleChange(q._id, e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <select
                  value={answers[q._id] || ""}
                  onChange={(e) => handleChange(q._id, e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {q.options.map((opt: string, idx: number) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading} // ✅ disable while loading
            className={`w-full p-3 rounded-lg transition duration-300 ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit"} {/* ✅ dynamic label */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormSubmission;
