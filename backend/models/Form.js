const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [
    {
      type: {
        type: String,
        enum: ['multiple-choice', 'text'], // you can extend this list
        required: true,
      },
      text: { type: String, required: true },
      options: { type: [String], default: [] }, // array of strings
    }
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Form', formSchema);
