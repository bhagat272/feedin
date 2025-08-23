// FormSubmission.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FormSubmission: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<any | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/forms/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        console.error('Error fetching form:', err);
      }
    };
    fetchForm();
  }, [id, token]);

  const handleChange = (qId: string, value: string) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('Not authenticated');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/responses/${id}`, {
        answers: Object.keys(answers).map((key) => ({ questionId: key, answer: answers[key] })),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Submitted!');
      window.history.back(); // Navigate back to dashboard or form list
    } catch (err) {
      alert('Submission failed: ' + (err as any)?.response?.data?.error || 'Unknown error');
    }
  };

  if (!form) return <div className="text-center text-gray-600 mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{form.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.questions.map((q: any) => (
            <div key={q._id} className="space-y-2">
              <label className="block text-gray-700">{q.text}</label>
              {q.type === 'text' ? (
                <input
                  type="text"
                  onChange={(e) => handleChange(q._id, e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <select
                  onChange={(e) => handleChange(q._id, e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {q.options.map((opt: string, index: number) => (
                    <option key={index} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormSubmission;