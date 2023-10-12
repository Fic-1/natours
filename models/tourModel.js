const mongoose = require('mongoose');

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name <Error string>'], //Validator
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true, //Removes all the whitespace in the beginning and end
    required: [true, 'A tour must have a summary'],
  },
  description: {
    type: String,
    required: [true, 'A tour must have a price'],
    trim: true,
  },
  imageCover: {
    type: String, //Name of the img - img is in fs
    required: [true, 'A tour must have a cover image'],
  },
  images: [String], //defining array of strings
  createdAt: {
    type: Date,
    default: Date.now(), // JS returns miliseconds --> Mongoose coverts to date
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
