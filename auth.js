const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('./models/userModel');
const handler = require('./handlers/errorHandler');

// Registration
passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        let user;

        if (emailRegex.test(email) && password.trim().length !== 0) {
          user = await UserModel.create({ email, password });
        }

        if (!user || password.trim().length === 0) {
          const err = new Error();
          err.status = 401;
          return done(handler.formatError(err, 'Invalid credentials', 401));
        } else {
          return done(null, user);
        }
      } catch (error) {
        const err = new Error();
        err.status = 400;
        done(handler.formatError(err, 'User already exists', 400));
      }
    }
  )
);

// Login feature
passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return done(null, false);
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false);
        }

        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);

const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

// Check if token is valid
passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'top_secret',
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        res.status(401);
        done(
          handler.formatError(
            err,
            'Failed to authenticate (invalid credentials)',
            401
          )
        );
      }
    }
  )
);
