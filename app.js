const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const router = require('./src/public/scripts/utils/router');

/**
 * Mongoose Setup
 */

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, autoIndex: false });

/**
 * Express Setup
 */

const app = express();
app.set(`view engine`, `ejs`);
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride(`_method`));
app.use(cookieParser(process.env.SECRET));
app.use(session({ secret: process.env.SECRET , resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`MyStudySpace is running on port ${process.env.PORT}.
Press Ctrl + C to stop the server!`);
});