const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  //EXECUTE QUERY
  let filter;
  if (req.params.tourid) filter = { tour: req.params.tourid };

  const reviews = await Review.find(filter);
  //SEND RESPONSE
  res.status(200).json({
    staus: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.setTourAndUserIds = (req, res, next) => {
  //* radimo middleware koji se izvrši prije createReview - dodan u router.post
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourid;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
