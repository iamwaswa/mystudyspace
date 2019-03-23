const passportLocal = require('passport-local');
const User = require('../models/user');
const { signUpAsync, loginAsync } = require('./bcrypt');

const initializePassport = (passport) => {

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    if (user) {
      done(null, user);
    }
  });
  
  passport.use(`local-signup`, new passportLocal.Strategy(async (username, password, done) => {
    try {
      const userFound = await User.findOne({ username });
      if (userFound) {
        return done(null, false, { message: `Username already exists. Please choose a different one!` });
      }
  
      const createdUser = await signUpAsync(username, password);
      return done(null, createdUser, { message: `Hello ${username}. You are now signed up!` });
    } catch (error) {
      console.error(error);
    }
  }));
  
  passport.use(`local-login`, new passportLocal.Strategy(async (username, password, done) => {
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
};

module.exports = initializePassport;