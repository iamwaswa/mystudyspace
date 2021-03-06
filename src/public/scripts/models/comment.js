const mongoose = require(`mongoose`);

const CommentSchema = new mongoose.Schema({
  text: String,
  created: Number,
  author: String,
  studyspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `studyspaces`,
  },
});

module.exports = mongoose.model(`comments`, CommentSchema);