const express = require('express');
const todoController = require('../controllers/todoController');
const commentController = require('../controllers/commentController');
const router = express.Router();
const validator = require('../middleware/validations');

// Todos routes
router.get('/todos', todoController.index);
router.post('/todos', validator.todoAdd, todoController.new);
router.put('/todos/:id', validator.todoEdit, todoController.put);
router.delete('/todos/:id', todoController.delete);

// Comments routes
router.get('/todos/:id/comments', commentController.index);
router.post(
  '/todos/:id/comments',
  validator.commentValidation,
  commentController.new
);
router.put(
  '/todos/:id/comments/:id',
  validator.commentValidation,
  commentController.put
);
router.delete('/todos/:id/comments/:id', commentController.delete);

router.get('/profile', (req, res, next) => {
  res.json({
    message: 'Hello',
    user: req.user,
    token: req.query.secret_token
  });
});

module.exports = router;
