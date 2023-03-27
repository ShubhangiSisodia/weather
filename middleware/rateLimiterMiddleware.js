const rateLimit = require('express-rate-limit');

const rateLimiterMiddleware = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 1,
  message: { error: 'Too many requests, please try again later.' },
});

module.exports = rateLimiterMiddleware;
