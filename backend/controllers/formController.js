// formController.js
const Form = require('../models/Form');

exports.createForm = async (req, res) => {
  try {
    const { title, questions } = req.body;
    if (!req.userId) return res.status(401).json({ error: 'User not authenticated' });

    const form = new Form({ title, questions, user: req.userId });
    await form.save();

    res.status(201).json({ message: 'Form created successfully ✅', form });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getForms = async (req, res) => {
  try {
    if (!req.userId) return res.status(401).json({ error: 'User not authenticated' });

    const forms = await Form.find({ user: req.userId });
    res.status(200).json({ forms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPublicForm = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await Form.findById(id).select('title questions'); // Exclude sensitive data
    if (!form) return res.status(404).json({ error: 'Form not found' });

    res.status(200).json(form);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
 