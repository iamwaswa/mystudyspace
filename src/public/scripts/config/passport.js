const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('../models/user');
const { loginAsync } = require('./bcrypt');

passport.use(new passportLocal.Strategy(async (username, password, done) => {
  try {
    const userFound = await User.findOne({ username });
  
    if (!userFound) {
      return done(null, false, { message: `Incorrect username. Please try again!` });
    }
  
    const isValidated = await loginAsync(password, userFound.password);
    if (!isValidated) {
      return done(null, false, { message: `Incorrect password. Please try again!` });
    }
  
    return done(null, userFound, { message: `Hello ${username}. You are now logged in!` });
  } catch (error) {
    console.error(error);
  }
}));

passport.serializeUser((user, done) => {
  console.log(`Serializing...`);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`Deserializing...`);
  const user = await User.findById(id);
  if (user) {
    done(err, user);
  }
});

module.exports = passport;