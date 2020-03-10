const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }]
});

// Save password as a hash
userSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 2);

  this.password = hash;

  next();
});

userSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

const User = (module.exports = mongoose.model('User', userSchema));

module.exports.get = function(callback) {
  User.find(callback);
};
