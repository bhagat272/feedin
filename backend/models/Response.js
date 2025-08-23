const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  answer: String,
  questionIndex: Number,
});

const responseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: [answerSchema],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Response', responseSchema);