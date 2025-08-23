const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.signup);

router.post('/login', authController.login);

module.exports = router;