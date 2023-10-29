const mongoose = require('mongoose');
const Tour = require('./tourModel');

const catchAsync = require('../utils/catchAsync');
// review / rating / createdAt / ref to tour / ref to user
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be above or equal 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({ path: 'user', select: 'name photo' });
  //   this.populate({ path: 'tour', select: 'name' });

  this.populate({ path: 'user', select: 'name photo' });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    //* U static metodi this pokazuje na trenutni model
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0] ? stats[0].nRatings : 0,
    ratingsAverage: stats[0] ? stats[0].avgRating : 4.5,
  });
};

reviewSchema.post('save', function () {
  //* this points to current review ; this.constructor points on current model
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  //* Goal: get acces to a curren document
  this.r = await this.findOne();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // this.r = await this.findOne(); //! Does not work here, query already executed
  this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

// POST /tour/2012516/reviews  //!Nested route reviews je child od tours resource
// GET /tour/2012516/reviews  //!Get all reviews for specific tour
// GET /tour/2012516/reviews/1264165  //!Get specific review for specific tour
