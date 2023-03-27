const validateCity = (req, res, next) => {
    const city = req.query.city;
  
    if (typeof city !== 'string' || !/^[a-zA-Z ]+$/.test(city)) {
      return res.status(400).json({ error: 'Invalid city name' });
    }
  
    next();
  };
  
  module.exports = {
    validateCity,
  };
  