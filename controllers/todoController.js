// Import todo model
const Todo = require('../models/todoModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const handler = require('../handlers/errorHandler');

// Handle index action
exports.index = function(req, res) {
  Todo.get(function(err, todos) {
    if (err) {
      res.status(400);
      res.json(handler.formatError(err, 'Failed to get todos', 400));
    }

    const filteredTodos = todos.filter(todo => {
      return todo.user.toString() === req.user._id;
    });

    res.json({
      status: 'success',
      message: 'Todos retrieved successfully',
      user: req.user.email,
      user_id: req.user._id,
      data: filteredTodos
    });
  });
};

// Handle create todo action
exports.new = function(req, res) {
  const todo = new Todo();

  todo.value = req.body.value;
  todo.completed = req.body.completed;
  todo.editing = req.body.editing;
  todo.user = req.user._id;

  todo.save(function(err) {
    if (err) {
      res.status(400);
      res.json(handler.formatError(err, 'Failed to create todo', 400));
    } else {
      res.json({
        message: 'New todo created!',
        data: todo
      });
    }
  });
};

// Handle edit todo action
exports.put = function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
    if (err || todo === null || req.user._id !== todo.user.toString()) {
      res.status(400);
      res.json(handler.formatError(err, 'Failed to update todo', 400));
    } else {
      todo.value = req.body.value;
      todo.completed = req.body.completed;
      todo.editing = req.body.editing;

      todo.save(function(err) {
        if (err) {
          res.status(400);
          res.json(
            handler.formatError(err, 'Failed to save updated todo', 400)
          );
        }
        res.json({
          message: 'Todo updated!',
          data: todo
        });
      });
    }
  });
};

// Handle delete todo action
exports.delete = function(req, res) {
  Todo.findOneAndDelete({ _id: req.params.id }, function(err, todo) {
    if (err || todo === null) {
      res.status(400);
      res.json(handler.formatError(err, 'Failed to delete todo', 400));
    } else {
      todo.comments.forEach(comment => {
        Comment.findOneAndDelete({ _id: comment }, function(err, comment) {
          if (err) {
            res.status(400);
            res.json(handler.formatError(err, 'Failed to delete todo', 400));
          }
        });
      });

      User.findById(todo.user, function(err, user) {
        if (err || user === null) {
          res.status(400);
          res.json(handler.formatError(err, 'Failed to delete todo', 400));
        } else {
          let filteredTodos = user.todos.filter(userTodo => {
            if (userTodo !== todo._id) {
              return userTodo;
            }
          });

          user.todos = filteredTodos;
          user.save();
        }
      });

      res.json({
        message: 'Todo deleted!',
        todo: todo
      });
    }
  });
};
