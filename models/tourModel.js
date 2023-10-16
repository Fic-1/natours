const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name <Error string>'], //Validator
      unique: true, //Not really a validator
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Name must only contain characters!'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Dificulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above or equal 1.0'],
      max: [5, 'Rating must be above or equal 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true, //Removes all the whitespace in the beginning and end
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      required: [true, 'A tour must have a price'],
      trim: true,
    },
    imageCover: {
      type: String, //Name of the img - img is in fs
      required: [true, 'A tour must have a cover image'],
    },
    images: [String], //defining array of strings
    createdAt: {
      type: Date,
      default: Date.now(), // JS returns miliseconds --> Mongoose coverts to date
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
  },
);

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//DOCUMENT MIDDLEWARE runs bedore .save() and .create(); not before .insertMany()
toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// toursSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// toursSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
// toursSchema.pre('find', function (next)
toursSchema.pre(/^find/, function (next) {
  //Koristimo RegEx da definiramo da se middleware aktivira za sve query-e koji počinju sa riječi find
  this.find({ secretTour: { $ne: true } }); //findOne, findMany....
  this.start = Date.now();
  next();
});
toursSchema.post(/^find/, function (docs, next) {
  console.log(`Query took: ${Date.now() - this.start} miliseconds`);
  console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARE
toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this);
  next();
});

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
