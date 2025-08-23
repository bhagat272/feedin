const express = require('express');
const authenticateToken = require('../middleware/auth');
const router = express.Router();
const formController = require('../controllers/formController');

// 📌 Create a new form
router.post('/', authenticateToken, formController.createForm);

// 📌 Get all forms of logged-in user
router.get('/', authenticateToken, formController.getForms);

module.exports = router;
