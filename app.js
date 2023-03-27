const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const rateLimit = require("express-rate-limit");
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const validationMiddleware = require('./middleware/validationMiddleware');
const rateLimiterMiddleware = require('./middleware/rateLimiterMiddleware');
const errorLogger = require('./utils/errorLogger');
const redisService = require('./services/redisService');


const app = express();
const port = process.env.PORT || 3000;


const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

redisClient.on('error', (err) => {
  console.log('Redis error:', err);
});

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, 
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));


const rateLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 1,
  message: "Too many requests, please try again later."
});

app.use(cors());

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB error:', err));

app.use(authMiddleware.checkAuth);

app.use('/weather', rateLimiterMiddleware.rateLimiter);

app.use('/weather', validationMiddleware.validateCity);

app.use('/auth', authRoutes);

app.use('/weather', weatherRoutes);

app.use(errorLogger.logErrors);

redisService.startWeatherCaching();

app.listen(port, () => console.log(`Server started on port ${port}`));
