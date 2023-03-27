const redis = require('redis');
const { promisify } = require('util');
const redisClient = require('../redisClient');

const client = redis.createClient("redis://myuser:mypassword@redis.example.com:6379");

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.log(`Redis error: ${err}`);
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const cacheData = async (key, data) => {
  await setAsync(key, JSON.stringify(data), 'EX', 1800);
};

const getCachedData = async (key) => {
  const data = await getAsync(key);
  if (data === null) {
    return null;
  }
  return JSON.parse(data);
};

const blacklistToken = (token) => {
  redisClient.set(token, 'blacklisted');
  redisClient.expire(token, 30 * 60); 
};

module.exports = {
  cacheData,
  getCachedData,
  blacklistToken
};
