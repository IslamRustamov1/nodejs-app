const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const handler = require('../handlers/errorHandler');

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.json({
      message: 'Signup successful',
      user: req.user
    });
  }
);

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        res.status(401);
        return next(
          handler.formatError(
            err,
            'Failed to authenticate (invalid credentials)',
            401
          )
        );
      }
      req.login(user, { session: false }, async error => {
        if (error) {
          return next(error);
        }

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, 'top_secret');

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

// Export API routes
module.exports = router;
