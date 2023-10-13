const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //BUILD QUERY
    //1A)Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    //1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //Regular expression(REGEX) za matchanje tocno tih rijeci; dodajemo $ na pocetak operatora
    let query = Tour.find(JSON.parse(queryStr));

    //2) Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); //DEFAULT
    }

    //3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
      // Only selecting few field names is called PROJECTING
    } else {
      query = query.select('-__v'); //Excluding __v field
    }

    //4) Pagination
    const page = +req.query.page || 1; // by default page 1
    const limit = +req.query.limit || 100; //by default 100
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }
    //skip - količina rezulata koju treba preskočiti prije query-anja podataka
    //limit - koliko rezultata se prikazuje

    //EXECUTE QUERY
    const tours = await query;

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //SEND RESPONSE
    res.status(200).json({
      staus: 'success',
      results: tours.length, //When sending array with multiple results QOL
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: 'err',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); // Mongoose shorthand
    // Tour.findOne({_id: req.params.id}) - original method
    res.status(200).json({
      staus: 'success',
      requestedAt: req.reqTime,
      data: {
        tour: tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: 'Wrong ID',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body); //Returns a promise
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: 'Invalid data sent!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: 'Invalid data sent!',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      //No content
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: 'Invalid data sent!',
    });
  }
};
