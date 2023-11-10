const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      'Your booking was successful! Please check your emailfor confirmation. If your booking doesnt shpw up immediately, please come later.';
  next();
};

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

  if (!tour) return next(new AppError('There is no tour with that name.', 404));

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

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  //* 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  //* Find tours with the returned IDs
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My tours',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).render('account', {
    title: 'Log into your account',
    user: updatedUser,
  });
});
