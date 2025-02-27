const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Si lees esto, la cagaste en grande xd!' });
  };
  
  module.exports = errorHandler;