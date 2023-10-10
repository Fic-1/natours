const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    staus: 'success',
    requestedAt: req.requestTime,
    results: tours.length, //When sending array with multiple results QOL
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  req.reqTime = new Date().toISOString();
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);
  // if (id > tours.length)
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  }

  res.status(200).json({
    staus: 'success',
    requestedAt: req.reqTime,
    data: {
      tour: tour,
    },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours.at(-1).id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'sucess',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  if (+req.params.id > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  if (+req.params.id > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'invalid ID',
    });
  res.status(204).json({
    //No content
    status: 'success',
    data: null,
  });
};
