import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createForm } from '../redux/reducers/formSlice'; // ✅ import from slice

const CreateForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<{ type: string; text: string; options: string[] }[]>([{ type: 'text', text: '', options: [] }]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state.auth);
  const { loading, error } = useSelector((state: any) => state.forms);

  const addQuestion = () => {
    if (questions.length < 5) setQuestions([...questions, { type: 'text', text: '', options: [] }]);
  };

  const updateQuestion = (index: number, field: keyof { type: string; text: string; options: string[] }, value: string) => {
    const newQuestions = [...questions];
if (field === "options") {
  newQuestions[index][field] = value.split(","); // convert to string[]
} else {
  newQuestions[index][field] = value; // normal string
}
    setQuestions(newQuestions);
  };

  const addOption = (index: number) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push('');
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length < 3) return alert('Need at least 3 questions');
    if (!token) return alert('Not authenticated');

    const result = await dispatch<any>(createForm({ title, questions, token }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Form</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {questions.map((q, i) => (
            <div key={i} className="space-y-4">
              <div className="flex space-x-4">
                <select
                  value={q.type}
                  onChange={(e) => updateQuestion(i, 'type', e.target.value)}
                  className="w-1/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="multiple-choice">Multiple Choice</option>
                </select>
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestion(i, 'text', e.target.value)}
                  placeholder="Question Text"
                  required
                  className="w-2/3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {q.type === 'multiple-choice' && (
                <div className="pl-4 space-y-2">
                  {q.options.map((opt, j) => (
                    <input
                      key={j}
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(i, j, e.target.value)}
                      placeholder={`Option ${j + 1}`}
                      required
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(i)}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition duration-300"
                  >
                    Add Option
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={addQuestion}
              disabled={questions.length >= 5}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300 disabled:opacity-50"
            >
              Add Question
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateForm;
