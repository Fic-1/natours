const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //* 1) Get tour data from the collection
  const tours = await Tour.find();
  //* 2) Build template

  //* 3) Render template using the tour data from 1)
  res.status(200).render('overview', {
    title: 'All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //* 1) Get data for requested tour (including revires and tour guides)
  const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate({
    path: 'reviews',
    fileds: 'review rating user',
  });
  const users = await User.find({ role: ['guide', 'lead-guide'] });
  //* 2) build template
  //* 3) Render the template using the data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    users,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};
