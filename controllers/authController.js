const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'Success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //* 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //* 2) Check if user exist && password is correct
  const user = await User.findOne({ email }).select('+password');

  //* 3) If everything is ok, send token to client
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  //* response
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //* 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access'),
      401,
    );
  }
  //* 2) Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //* 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('User belonging to this token no longer exist', 401),
    );

  //* 4) Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Token was issued before the password was changed', 401),
    );
  }
  //Grant access to protected route
  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    //* Roles ['admin', 'lead-guide']. role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(
        new Error('You do not have permission to do this function!', 403),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //* 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with that email addess', 404));
  //* 2) Generate random reset token -> instance method in model
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); //! Spremamo kako bi updatali DB
  //! Bez opcije za validaciju request ne prolazi i traži da upišemo sve potrebne podatke
  //* 3) Send it to user's email
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and password confirm to ${resetUrl}\n If you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'Success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending email! Please try again later.'),
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //* 1) Get user based on the token

  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //* 2) Set the new password only if token is not expired and there is a user.
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //* 3) Update the changedPasswordAt property for the user
  //* 4) Log the user in, send JWT
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // if (!req.body.email || !req.body.password)
  //   return next(new AppError('Please enter password and email', 400));
  //* 1) Get user from the collection
  const currentUser = await User.findById(req.user.id).select('+password');
  //* 2) Check if POSTed current password is correct
  if (
    !(await currentUser.correctPassword(
      req.body.passwordCurrent,
      currentUser.password,
    ))
  ) {
    return next(new AppError('Current password is wrong!', 401));
  }
  //* 3) If so, update password
  currentUser.password = req.body.password;
  currentUser.passwordConfirm = req.body.passwordConfirm;
  await currentUser.save();
  //* 4) Log user in, send JWT
  createAndSendToken(currentUser, 200, res);
});