import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createForm } from "../redux/reducers/formSlice";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const CreateForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<
    { type: string; text: string; options: string[] }[]
  >([{ type: "text", text: "", options: [] }]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state: any) => state.auth);
  const { loading, error } = useSelector((state: any) => state.forms);

  const addQuestion = () => {
    if (questions.length < 5)
      setQuestions([...questions, { type: "text", text: "", options: [] }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (
    index: number,
    field: keyof { type: string; text: string; options: string[] },
    value: string
  ) => {
    const newQuestions = [...questions];
    if (field === "options") {
      newQuestions[index][field] = value.split(",");
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const addOption = (index: number) => {
    const newQuestions = [...questions];
    newQuestions[index].options.push("");
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length < 3) return alert("Need at least 3 questions");
    if (!token) return alert("Not authenticated");

    const result = await dispatch<any>(createForm({ title, questions, token }));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
      toast.success("Feedback Form created successfully! ✅", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <div className="max-w-3xl mx-auto">
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

        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center drop-shadow-md">
          Create Feedback Form
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl space-y-6"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Form Title"
            required
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />

          {questions.map((q, i) => (
            <div
              key={i}
              className="bg-gray-50 p-6 rounded-xl shadow-inner space-y-4 relative"
            >
              <button
                type="button"
                onClick={() => removeQuestion(i)}
                className="absolute top-1 right-4 p-2  shadow bg-white text-red-500 hover:text-red-700 hover:shadow-lg transition"
              >
                <FaTrash />
              </button>

              <div className="flex flex-col md:flex-row gap-4">
                <select
                  value={q.type}
                  onChange={(e) => updateQuestion(i, "type", e.target.value)}
                  className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="multiple-choice">Multiple Choice</option>
                </select>

                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestion(i, "text", e.target.value)}
                  placeholder="Question Text"
                  required
                  className="w-full md:w-2/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {q.type === "multiple-choice" && (
                <div className="pl-4 space-y-2">
                  {q.options.map((opt, j) => (
                    <div key={j} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => updateOption(i, j, e.target.value)}
                        placeholder={`Option ${j + 1}`}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(i, j)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(i)}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition duration-300"
                  >
                    <FaPlus /> Add Option
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <button
              type="button"
              onClick={addQuestion}
              disabled={questions.length >= 5}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300 disabled:opacity-50"
            >
              <FaPlus /> Add Question
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-300 shadow-lg"
            >
              {loading ? "Creating..." : "Create Form"}
            </button>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateForm;
