const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

passport
  .use(new LocalStrategy(async (username, password, done) => {

    const userFound = await User.findOne({ username });

    if (!userFound) {
      return done(null, false, { message: `User does not exist or incorrect details` });
    }

    if (!userFound.validPassword(password)) {
      return done(null, false, { message: `Incorrect password.` });
    }

    return done(null, userFound, { message: `Welcome ${username}` });
  }
));