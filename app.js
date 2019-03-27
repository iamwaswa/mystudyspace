const express = require(`express`);
const mongoose = require(`mongoose`);
const bodyParser = require(`body-parser`);
const methodOverride = require(`method-override`);
const cookieParser = require(`cookie-parser`);
const session = require(`express-session`);
const flash = require(`connect-flash`);
const passport = require(`passport`);
const initializePassport = require(`./src/public/scripts/config/passport`);
const commentRoutes = require(`./src/public/scripts/routes/comment`);
const homeRoutes = require(`./src/public/scripts/routes/home`);
const notFoundRoutes = require(`./src/public/scripts/routes/notfound`);
const promptRoutes = require(`./src/public/scripts/routes/prompt`);
const studyspaceRoutes = require(`./src/public/scripts/routes/studyspace`);
const studyspacesRoutes = require(`./src/public/scripts/routes/studyspaces`);
const initializeAuthRoutes = require(`./src/public/scripts/routes/userauth`);

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

app.use(`/`, commentRoutes);
app.use(`/`, homeRoutes);
app.use(`/`, notFoundRoutes);
app.use(`/`, promptRoutes);
app.use(`/`, studyspaceRoutes);
app.use(`/`, studyspacesRoutes);
app.use(`/`, initializeAuthRoutes(passport));

app.listen(process.env.PORT, () => {
  console.log(`MyStudySpace is running on port ${process.env.PORT}.
Press Ctrl + C to stop the server!`);
});