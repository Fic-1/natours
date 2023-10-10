const express = require('express');
const morgan = require('morgan');
const timeout = require('connect-timeout');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
app.use(timeout(1));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//ROUTES

app.use('/api/v1/tours', tourRouter); // MOUNTING THE ROUTER
app.use('/api/v1/users', userRouter);

// start up the server
module.exports = app;
