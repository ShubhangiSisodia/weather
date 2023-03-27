const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');
const rateLimiterMiddleware = require('../middleware/rateLimiterMiddleware');

router.get('/current-weather', authMiddleware.authenticateToken, rateLimiterMiddleware.rateLimiter, validationMiddleware.validateCity, weatherController.getCurrentWeather);

module.exports = router;
