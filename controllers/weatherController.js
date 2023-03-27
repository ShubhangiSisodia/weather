const { WeatherService } = require('../services');

const getCurrentWeather = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City parameter is missing' });
    }

    const weatherData = await WeatherService.getCurrentWeather(city);

    return res.json({ weather: weatherData });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getCurrentWeather,
};
