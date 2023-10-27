// const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourAndUserIds = (req, res, next) => {
  //* radimo middleware koji se izvrši prije createReview - dodan u router.post
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourid;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
