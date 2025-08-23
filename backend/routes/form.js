const express = require('express');
const Form = require('../models/Form');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// 📌 Create a new form
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, questions } = req.body;
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const form = new Form({ title, questions, user: req.userId });
    await form.save();

    res.status(201).json({
      message: "Form created successfully ✅",
      form
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 Get all forms of logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const forms = await Form.find({ user: req.userId });
    res.status(200).json({ forms });  // 👈 return wrapped in object
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
