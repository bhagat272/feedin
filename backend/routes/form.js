const express = require('express');
const authenticateToken = require('../middleware/auth');
const router = express.Router();
const formController = require('../controllers/formController');

// 📌 Create a new form
router.post('/', authenticateToken, formController.createForm);

// 📌 Get all forms of logged-in user
router.get('/', authenticateToken, formController.getForms);
// 📌 Get a public form by ID
router.get('/:id', formController.getPublicForm);
// 📌 Submit a response to a form
router.post('/:id/responses', formController.submitResponse);

module.exports = router;
