import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const ResponsesPage = () => {
  const { formId } = useParams();
  const { token } = useSelector((state: any) => state.auth);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5002/api/responses/${formId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setResponses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (formId && token) fetchResponses();
  }, [formId, token]);

  if (loading) return <p>Loading responses...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Responses</h2>
      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <ul className="space-y-4">
          {responses.map((res, idx) => (
            <li key={idx} className="p-4 border rounded-lg shadow">
              {res.answers.map((ans: any, i: number) => (
                <p key={i}>
                  <strong>
                    {ans.questionId?.text || "Question"}:
                  </strong>{" "}
                  {ans.answer}
                </p>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResponsesPage;
