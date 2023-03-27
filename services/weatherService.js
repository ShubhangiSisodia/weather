const axios = require('axios');
const redisService = require('./redisService');
require('dotenv').config();

const getCurrentWeather = async (city) => {
  const cachedWeatherData = await redisService.getCachedData(city);
  if (cachedWeatherData !== null) {
    return cachedWeatherData;
  }
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
  const weatherData = response.data;
  await redisService.cacheData(city, weatherData);
  return weatherData;
};

module.exports = {
  getCurrentWeather,
};
