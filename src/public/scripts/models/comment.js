const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: String,
  studyspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `studyspaces`,
  }
});

module.exports = mongoose.model(`comments`, CommentSchema);