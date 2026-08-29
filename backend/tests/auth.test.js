const request = require('supertest');
const { app } = require('./helpers');

describe('Auth', () => {
  test('registro crea usuario y nunca devuelve el password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nuevo@test.com', password: 'secreta123' });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe('nuevo@test.com');
    expect(res.body.rol).toBe('user'); // default
    expect(res.body.password).toBeUndefined();
  });

  test('registro con rol admin explícito lo respeta', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'admin2@test.com', password: 'secreta123', rol: 'admin' });

    expect(res.status).toBe(201);
    expect(res.body.rol).toBe('admin');
  });

  test('registro con email duplicado devuelve 409', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@test.com', password: 'secreta123' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@test.com', password: 'otraClave' });

    expect(res.status).toBe(409);
  });

  test('login con credenciales correctas devuelve un token', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login@test.com', password: 'secreta123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'secreta123' });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
  });

  test('login con password incorrecto devuelve 401', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login2@test.com', password: 'secreta123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login2@test.com', password: 'incorrecta' });

    expect(res.status).toBe(401);
  });

  test('login con email inexistente devuelve 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'no-existe@test.com', password: 'secreta123' });

    expect(res.status).toBe(401);
  });
});
