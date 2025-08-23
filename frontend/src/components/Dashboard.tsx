import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/reducers/authSlice';

const Dashboard: React.FC = () => {
  const [forms, setForms] = React.useState<any[]>([]);
  const [selectedForm, setSelectedForm] = React.useState<string | null>(null);
  const [responses, setResponses] = React.useState<any[]>([]);
  const [summary, setSummary] = React.useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.token);

  // ✅ Dummy data (replace API with mock until backend ready)
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const dummyForms = [
      {
        _id: 'form1',
        title: 'Customer Feedback Form',
        questions: [
          { _id: 'q1', text: 'How satisfied are you with our service?' },
          { _id: 'q2', text: 'Would you recommend us to others?' },
        ],
      },
      {
        _id: 'form2',
        title: 'Event Registration Form',
        questions: [
          { _id: 'q1', text: 'What is your name?' },
          { _id: 'q2', text: 'Which event are you attending?' },
        ],
      },
    ];

    setForms(dummyForms);
  }, [token, navigate]);

  const viewResponses = (formId: string) => {
    setSelectedForm(formId);

    // ✅ Dummy responses
    const dummyResponses = [
      {
        _id: 'resp1',
        submittedAt: new Date(),
        answers: [
          { questionId: 'q1', answer: 'Very Satisfied' },
          { questionId: 'q2', answer: 'Yes' },
        ],
      },
      {
        _id: 'resp2',
        submittedAt: new Date(),
        answers: [
          { questionId: 'q1', answer: 'Neutral' },
          { questionId: 'q2', answer: 'Maybe' },
        ],
      },
    ];

    const dummySummary = [
      {
        answers: [
          { answer: 'Very Satisfied', count: 1 },
          { answer: 'Neutral', count: 1 },
        ],
      },
      {
        answers: [
          { answer: 'Yes', count: 1 },
          { answer: 'Maybe', count: 1 },
        ],
      },
    ];

    setResponses(dummyResponses);
    setSummary(dummySummary);
  };

  const exportCSV = (formId: string) => {
    alert(`CSV export for form ${formId} (mocked)`); // ✅ placeholder
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => navigate('/create-form')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Create Form
          </button>
          <button
            onClick={() => dispatch(logout())}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
          >
            Logout
          </button>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Forms</h3>
        <ul className="space-y-4">
          {forms?.map((form) => (
            <li key={form._id} className="bg-white p-4 rounded-lg shadow-md">
              <span className="font-medium text-gray-800">{form.title}</span>
              <button
                onClick={() => viewResponses(form._id)}
                className="ml-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-300"
              >
                View Responses
              </button>
              <span className="ml-4 text-gray-600">
                Public URL: {window.location.origin}/form/{form._id}
              </span>
            </li>
          ))}
        </ul>
        {selectedForm && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Responses (Tabular)
            </h3>
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 text-left">Submitted At</th>
                  {forms
                    .find((f) => f._id === selectedForm)
                    ?.questions.map((q: any) => (
                      <th key={q._id} className="p-3 text-left">
                        {q.text}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {responses.map((resp) => (
                  <tr key={resp._id} className="border-t">
                    <td className="p-3">
                      {new Date(resp.submittedAt).toLocaleString()}
                    </td>
                    {resp.answers.map((ans: any) => (
                      <td key={ans.questionId} className="p-3">
                        {ans.answer}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">
              Summary
            </h3>
            {summary.map((qSum: any, i: number) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow-md mb-4"
              >
                <h4 className="text-lg font-medium text-gray-800">
                  {forms.find((f) => f._id === selectedForm)?.questions[i].text}
                </h4>
                <ul className="list-disc pl-5 mt-2">
                  {qSum.answers.map((a: any) => (
                    <li key={a.answer} className="text-gray-600">
                      {a.answer}: {a.count}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={() => exportCSV(selectedForm)}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Export CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
