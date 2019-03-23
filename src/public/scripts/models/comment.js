const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: String,
  created: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `users`,
  },
  studyspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `studyspaces`,
  },
});

module.exports = mongoose.model(`comments`, CommentSchema);