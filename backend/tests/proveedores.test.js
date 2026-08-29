const request = require('supertest');
const { app, crearAdmin, crearUser } = require('./helpers');

describe('Proveedores', () => {
  test('admin puede crear un proveedor y queda activo:true por defecto', async () => {
    const token = await crearAdmin();

    const res = await request(app)
      .post('/api/proveedores')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Acme Corp', slug: 'acme-corp' });

    expect(res.status).toBe(201);
    expect(res.body.activo).toBe(true);
  });

  test('user recibe 403 al intentar crear un proveedor', async () => {
    const token = await crearUser();

    const res = await request(app)
      .post('/api/proveedores')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Acme Corp', slug: 'acme-corp' });

    expect(res.status).toBe(403);
  });

  test('user recibe 403 al intentar eliminar un proveedor', async () => {
    const adminToken = await crearAdmin();
    const userToken = await crearUser();

    const creado = await request(app)
      .post('/api/proveedores')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nombre: 'Beta SA', slug: 'beta-sa' });

    const res = await request(app)
      .delete(`/api/proveedores/${creado.body._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  test('slug de proveedor duplicado devuelve 409', async () => {
    const token = await crearAdmin();

    await request(app)
      .post('/api/proveedores')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Gamma', slug: 'gamma' });

    const res = await request(app)
      .post('/api/proveedores')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Gamma Dos', slug: 'gamma' });

    expect(res.status).toBe(409);
  });

  test('eliminar un proveedor con productos asociados devuelve 409', async () => {
    const token = await crearAdmin();

    const proveedor = await request(app)
      .post('/api/proveedores')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Delta', slug: 'delta' });

    await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        sku: 'SKU-DELTA-1',
        nombre: 'Producto Delta',
        precio: 10,
        stock: 5,
        categoria: 'hogar',
        proveedorId: proveedor.body._id,
      });

    const res = await request(app)
      .delete(`/api/proveedores/${proveedor.body._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(409);
  });

  test('eliminar un proveedor sin productos devuelve 204', async () => {
    const token = await crearAdmin();

    const proveedor = await request(app)
      .post('/api/proveedores')
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Epsilon', slug: 'epsilon' });

    const res = await request(app)
      .delete(`/api/proveedores/${proveedor.body._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});
