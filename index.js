require('./auth');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');

const app = express();

// Configure bodyparser to handle post requests
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());
app.use(cors());

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/nodejs-app', { useNewUrlParser: true });
mongoose.connection.on('error', error => console.log(error));

const db = mongoose.connection;

// Check for DB connection
!db
  ? console.log('Error connecting db')
  : console.log('Db connected successfully');

// Setup server port
const port = process.env.PORT || 3000;

console.log(port);

const routes = require('./routes/api-routes');
const secureRoute = require('./routes/secure-routes');

app.get('/', function(req, res) {
  res.send(
    '.../api/signup, .../api/login, .../api/user, .../api/user/todos, .../api/user/todos/1234567/comments'
  );
});

app.use('/api', routes);
app.use(
  '/api/user',
  passport.authenticate('jwt', { session: false }),
  secureRoute
);

// Error handling
app.use(function(err, req, res, next) {
  res.status(err.statusCode || 500);
  res.json({ error: err });
});

// Launch app to listen to specified port
app.listen(port, function() {
  console.log('Running Nodejs-app on port ' + port);
});

module.exports = app;
