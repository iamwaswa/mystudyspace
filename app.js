const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const initializePassport = require('./src/public/scripts/config/passport');
const initializeRouter = require('./src/public/scripts/utils/router');

// =====================================
// MONGOOSE SETUP ======================
// =====================================

mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, autoIndex: false });

// =====================================
// PASSPORT SETUP ======================
// =====================================

initializePassport(passport);

// =====================================
// EXPRESS SETUP =======================
// =====================================

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

// =====================================
// ROUTES SETUP ========================
// =====================================

const router = express.Router();

initializeRouter(router, passport);

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`MyStudySpace is running on port ${process.env.PORT}.
Press Ctrl + C to stop the server!`);
});