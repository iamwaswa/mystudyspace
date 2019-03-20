const mongoose = require('mongoose');

const StudySpaceSchema = new mongoose.Schema({
  name: String,
  type: String,
  address: String,
  postalCode: String,
  city: String,
  province: String,
  website: String,
  phone: String,
  image: String,
  rating: Number,
});

module.exports = mongoose.model(`studyspaces`, StudySpaceSchema);