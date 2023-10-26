const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();
//* 1) GLOBAL MIDDLEWARES

//?Set security HTTP headers
app.use(helmet());

//?Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//?Limit requests from same API
const limiter = rateLimit({
  max: 100, //? 100 request from the same IP
  windowMs: 60 * 60 * 1000, //? 1 hour
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//?Body parse, reading data frm body into req.body
app.use(express.json({ limit: '10kb' }));

//? Data sanatization against NoSQL query injections
app.use(mongoSanitize());

//? Data sanatization against XSS
app.use(xss());

//? Prevent parametar pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//? Serving static files
app.use(express.static(`${__dirname}/public`));

//? Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});
//*ROUTES
app.use('/api/v1/tours', tourRouter); // MOUNTING THE ROUTER
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

//* start up the server
module.exports = app;
