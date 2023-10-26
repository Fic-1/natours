const mongoose = require('mongoose');
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

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({ path: 'user', select: 'name photo' });
  //   this.populate({ path: 'tour', select: 'name' });

  this.populate({ path: 'user', select: 'name photo' });

  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

// POST /tour/2012516/reviews  //!Nested route reviews je child od tours resource
// GET /tour/2012516/reviews  //!Get all reviews for specific tour
// GET /tour/2012516/reviews/1264165  //!Get specific review for specific tour
