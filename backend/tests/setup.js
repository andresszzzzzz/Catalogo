process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const { conectarDB } = require('../src/config/db');
const redis = require('../src/config/redis');

beforeAll(async () => {
  await conectarDB({ retries: 5, delayMs: 1000 });
});

afterEach(async () => {
  // Limpia todas las colecciones entre tests para que sean independientes.
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  redis.disconnect();
});
