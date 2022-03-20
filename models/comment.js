const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  id: {
    type: 'String',
  },
  product_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  commented_at: {
    type: 'String',
    default: 1,
  },
  rating: {
    type: 'Number',
    required: true,
  },
  text: {
    type: 'String',
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;
