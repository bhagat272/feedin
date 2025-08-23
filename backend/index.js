const express = require('express');
const authRoutes = require('./routes/auth');
const formsRoutes = require('./routes/form');
const responsesRoutes = require('./routes/response');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // This line must be present

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
  origin: 'http://localhost:5173','https://feedin-eo3k0yd7g-bhagat272s-projects.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/responses', responsesRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running on port 5002' });
});
const dbConnect = require("./config/db");
dbConnect();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});