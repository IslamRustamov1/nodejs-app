const Comment = require('../models/commentModel');
const Todo = require('../models/todoModel');
const handler = require('../handlers/errorHandler');

exports.index = function(req, res) {
  Comment.get(function(err, comments) {
    if (err) {
      res.status(400);
      res.json(
        res.json(handler.formatError(err, 'Failed to get comments', 400))
      );
    }
    Todo.findOne({ _id: req.params.id }, (err, todo) => {
      if (todo) {
        res.json({
          status: 'success',
          message: 'Comments retrieved successfully',
          todo: todo.comments
        });
      } else {
        res.status(400);
        res.json(handler.formatError(err, 'Failed to get comments', 400));
      }
    });
  });
};

exports.new = function(req, res) {
  const comment = new Comment();

  comment.text = req.body.text;
  comment.todo = req.params.id;

  comment.save(function(err) {
    Todo.findById(req.params.id, (err, todo) => {
      if (todo) {
        todo.comments.push(comment);
        todo.save();

        res.json({
          message: 'New comment created!',
          data: comment
        });
      } else {
        res.status(400);
        res.json(handler.formatError(err, 'Failed to create a comment', 400));
      }
    });
  });
};

// Handle edit comment action
exports.put = function(req, res) {
  Comment.findById(req.params.id, function(err, comment) {
    if (err) {
      res.status(400);
      res.json(handler.formatError(err, 'Failed to update comment', 400));
    }

    comment.text = req.body.text;

    comment.save(function(err) {
      if (err) {
        res.status(400);
        res.json(handler.formatError(err, 'Failed to update comment', 400));
      }
      res.json({
        message: 'Comment updated!',
        data: comment
      });
    });
  });
};

// Handle delete comment action
exports.delete = function(req, res) {
  Comment.findByIdAndRemove(req.params.id, function(err, comment) {
    if (err || comment === null) {
      res.status(400);
      res.json(handler.formatError(err, 'Failed to delete comment', 400));
    } else {
      Todo.findById(comment.todo, function(err, todo) {
        const filteredComments = todo.comments.filter(todoComment => {
          return todoComment.toString() !== comment._id.toString();
        });

        todo.comments = filteredComments;

        todo.save();
      });

      res.json({
        message: 'Comment deleted!',
        comment: comment
      });
    }
  });
};
