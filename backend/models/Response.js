const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional if public
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
      answer: { type: String, required: true },
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Response", responseSchema);
