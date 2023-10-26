const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  //EXECUTE QUERY
  const features = new APIFeatures(Review.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const reviews = await features.query;
  //SEND RESPONSE
  res.status(200).json({
    staus: 'success',
    results: reviews.length, //When sending array with multiple results QOL
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourid;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body); //Returns a promise
  res.status(201).json({
    status: 'success',
    data: {
      reviews: newReview,
    },
  });
});
