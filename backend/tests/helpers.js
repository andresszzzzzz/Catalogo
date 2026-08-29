const request = require('supertest');
const crearApp = require('../src/app');

const app = crearApp();

async function registrarYLoguear(email, password, rol) {
  await request(app).post('/api/auth/register').send({ email, password, rol });
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

async function crearAdmin() {
  const token = await registrarYLoguear('admin@test.com', 'secreta123', 'admin');
  return token;
}

async function crearUser() {
  const token = await registrarYLoguear('user@test.com', 'secreta123', 'user');
  return token;
}

module.exports = { app, registrarYLoguear, crearAdmin, crearUser };
