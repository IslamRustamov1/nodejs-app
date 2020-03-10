const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = mongoose.Schema({
  value: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  editing: {
    type: Boolean,
    default: false
  },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

// Export Todo model
const Todo = (module.exports = mongoose.model('Todo', todoSchema));

module.exports.get = function(callback) {
  Todo.find(callback).populate('comments');
};
