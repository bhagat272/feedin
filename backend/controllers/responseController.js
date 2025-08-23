const Response = require('../models/Response');
const Form = require('../models/Form');

exports.submitResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    const form = await Form.findById(id);
    if (!form) return res.status(404).json({ error: 'Form not found' });

    const formattedAnswers = answers.map(ans => ({
      questionId: ans.questionId,
      answer: ans.answer.toString(),
    }));

    const response = new Response({
      form: id,
       answers: formattedAnswers,
      submittedAt: new Date(),
    });

    await response.save(); // ✅ Now this works because Response is a Mongoose model

    res.status(201).json({ message: 'Response submitted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getResponsesByForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const responses = await Response.find({ form: formId }); // no populate needed
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
