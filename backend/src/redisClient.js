const redis = require('redis');

const client = redis.createClient(); // Varsayılan olarak localhost:6379

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

(async () => {
  await client.connect();
})();

module.exports = client; 