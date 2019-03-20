const express = require('express');

/**
 * Express Setup
 */

const app = express();

app.get(`/`, (req, res) => {
  res.send(`Home page`)
});

app.get(`/*`, (req, res) => {
  res.send(`The page you are looking for does not exist!`);
});

app.listen(process.env.PORT, () => {
  console.log(`MyStudySpace is running on port ${process.env.PORT}.
  Press Ctrl + C to stop the server!`);
})