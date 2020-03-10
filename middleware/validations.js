const Joi = require('@hapi/joi');
const handler = require('../handlers/errorHandler');

const todoSchema = Joi.object({
  value: Joi.string()
    .min(1)
    .required(),
  editing: Joi.boolean().required(),
  completed: Joi.boolean().required()
});

const todoAdd = (req, res, next) => {
  const todo = {
    value: req.body.value,
    editing: req.body.editing,
    completed: req.body.completed
  };
  const { error, value } = todoSchema.validate({
    value: todo.value,
    editing: todo.editing,
    completed: todo.completed
  });
  if (error) {
    res.status(400);
    res.json({ error: handler.formatError(error, 'Invalid todo', 400) });
  } else {
    next();
  }
};

const todoEdit = (req, res, next) => {
  const todo = {
    value: req.body.value,
    editing: req.body.editing,
    completed: req.body.completed
  };
  const { error, value } = todoSchema.validate({
    value: todo.value,
    completed: todo.completed,
    editing: todo.editing
  });
  if (error) {
    res.status(400);
    res.json({ error: handler.formatError(error, 'Invalid todo', 400) });
  } else {
    next();
  }
};

const commentSchema = Joi.object({
  text: Joi.string()
    .min(1)
    .required()
});

const commentValidation = (req, res, next) => {
  const comment = {
    text: req.body.text
  };
  const { error, value } = commentSchema.validate({
    text: comment.text
  });
  if (error) {
    res.status(400);
    res.json({ error: handler.formatError(error, 'Comment is empty', 400) });
  } else {
    next();
  }
};

exports.todoAdd = todoAdd;
exports.todoEdit = todoEdit;
exports.commentValidation = commentValidation;
