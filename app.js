const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const router = require('./src/public/scripts/router');

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
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`MyStudySpace is running on port ${process.env.PORT}.
Press Ctrl + C to stop the server!`);
});