const express = require('express');
const Response = require('../models/Response');
const Form = require('../models/Form');
const authenticateToken = require('../middleware/auth');
const router = express.Router();
const responseController = require('../controllers/responseController');

router.post('/:id', responseController.submitResponse);

router.get('/:formId', authenticateToken, responseController.getResponsesByForm);

module.exports = router;