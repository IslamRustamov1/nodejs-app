const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Setup schema
const commentSchema = mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  todo: { type: Schema.Types.ObjectId, ref: 'Todo' }
});

// Export Todo model
const Comment = (module.exports = mongoose.model('Comment', commentSchema));

module.exports.get = function(callback) {
  Comment.find(callback);
};
