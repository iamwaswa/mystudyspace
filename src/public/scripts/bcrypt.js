const bcrypt = require('bcrypt');
const User = require('./models/user');
const saltRounds = 10;

const signUpAsync = async (username, password) => {
  try {
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    await User.create({
      username,
      password: encryptedPassword,
    });
  } catch (error) {
    console.error(error);
  }
};

const loginAsync = async (password, encryptedPassword) => {
  try {
    return await bcrypt.compare(password, encryptedPassword);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  signUpAsync,
  loginAsync,
};