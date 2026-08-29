const request = require('supertest');
const { app, crearAdmin, crearUser } = require('./helpers');

describe('Categorías', () => {
  test('GET /api/categorias devuelve lista (vacía si no hay imports aún)', async () => {
    const token = await crearUser();
    const res = await request(app)
      .get('/api/categorias')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/categorias/:slug inexistente devuelve 404', async () => {
    const token = await crearUser();
    const res = await request(app)
      .get('/api/categorias/no-existe')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  test('user recibe 403 al intentar PUT sobre una categoría', async () => {
    const token = await crearUser();
    const res = await request(app)
      .put('/api/categorias/64b000000000000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Nueva' });
    expect(res.status).toBe(403);
  });
});

describe('Infraestructura', () => {
  test('GET /health responde con status y estado de dependencias', async () => {
    const res = await request(app).get('/health');
    expect([200, 503]).toContain(res.status);
    expect(res.body).toHaveProperty('mongo');
    expect(res.body).toHaveProperty('redis');
  });

  test('Swagger levanta en /api/docs', async () => {
    const res = await request(app).get('/api/docs/');
    expect(res.status).toBe(200);
  });

  test('rutas admin sin token devuelven 401, no 403 ni 500', async () => {
    const res = await request(app).post('/api/proveedores').send({});
    expect(res.status).toBe(401);
  });
});
