const express = require('express');
const Response = require('../models/Response');
const Form = require('../models/Form');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.post('/:formId', authenticateToken, async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId);
    if (!form || form.user.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    const answers = Object.entries(req.body).map(([key, value]) => ({
      questionIndex: parseInt(key.replace('q', '')) - 1,
      answer: value,
    }));
    const response = new Response({ form: formId, answers });
    await response.save();
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:formId', authenticateToken, async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId);
    if (!form || form.user.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    const responses = await Response.find({ form: formId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;