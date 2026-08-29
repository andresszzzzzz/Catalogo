const request = require('supertest');
const { app, crearAdmin, crearUser } = require('./helpers');

async function crearProveedor(token, overrides = {}) {
  const res = await request(app)
    .post('/api/proveedores')
    .set('Authorization', `Bearer ${token}`)
    .send({ nombre: 'Proveedor Test', slug: 'proveedor-test', ...overrides });
  return res.body;
}

describe('Productos', () => {
  test('user recibe 403 en POST de productos', async () => {
    const adminToken = await crearAdmin();
    const userToken = await crearUser();
    const proveedor = await crearProveedor(adminToken);

    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        sku: 'SKU-1',
        nombre: 'Producto 1',
        precio: 10,
        stock: 5,
        categoria: 'ropa',
        proveedorId: proveedor._id,
      });

    expect(res.status).toBe(403);
  });

  test('user recibe 403 en PUT y DELETE de productos', async () => {
    const adminToken = await crearAdmin();
    const userToken = await crearUser();
    const proveedor = await crearProveedor(adminToken);

    const creado = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        sku: 'SKU-2',
        nombre: 'Producto 2',
        precio: 10,
        stock: 5,
        categoria: 'ropa',
        proveedorId: proveedor._id,
      });

    const put = await request(app)
      .put(`/api/productos/${creado.body._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ precio: 20 });
    expect(put.status).toBe(403);

    const del = await request(app)
      .delete(`/api/productos/${creado.body._id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(del.status).toBe(403);
  });

  test('crear producto sin token devuelve 401', async () => {
    const res = await request(app).post('/api/productos').send({});
    expect(res.status).toBe(401);
  });

  test('sku duplicado devuelve 409, no un 500', async () => {
    const adminToken = await crearAdmin();
    const proveedor = await crearProveedor(adminToken);
    const payload = {
      sku: 'SKU-DUP',
      nombre: 'Producto Dup',
      precio: 10,
      stock: 5,
      categoria: 'ropa',
      proveedorId: proveedor._id,
    };

    await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(409);
  });

  test('crear producto con proveedorId inexistente devuelve 404', async () => {
    const adminToken = await crearAdmin();

    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        sku: 'SKU-NOPROV',
        nombre: 'Sin proveedor',
        precio: 10,
        stock: 5,
        categoria: 'ropa',
        proveedorId: '64b000000000000000000000',
      });

    expect(res.status).toBe(404);
  });

  test('disponible se deriva de stock', async () => {
    const adminToken = await crearAdmin();
    const proveedor = await crearProveedor(adminToken);

    const conStock = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        sku: 'SKU-STOCK',
        nombre: 'Con stock',
        precio: 10,
        stock: 5,
        categoria: 'ropa',
        proveedorId: proveedor._id,
      });
    expect(conStock.body.disponible).toBe(true);

    const sinStock = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        sku: 'SKU-NOSTOCK',
        nombre: 'Sin stock',
        precio: 10,
        stock: 0,
        categoria: 'ropa',
        proveedorId: proveedor._id,
      });
    expect(sinStock.body.disponible).toBe(false);
  });

  test('listar productos soporta paginación y filtro por categoría', async () => {
    const adminToken = await crearAdmin();
    const proveedor = await crearProveedor(adminToken);

    await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        sku: 'SKU-A',
        nombre: 'A',
        precio: 10,
        stock: 1,
        categoria: 'electronica',
        proveedorId: proveedor._id,
      });
    await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        sku: 'SKU-B',
        nombre: 'B',
        precio: 10,
        stock: 1,
        categoria: 'ropa',
        proveedorId: proveedor._id,
      });

    const res = await request(app)
      .get('/api/productos?categoria=electronica&page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].sku).toBe('SKU-A');
  });

  test('GET /api/productos/stats devuelve totales y agrupado por categoría', async () => {
    const adminToken = await crearAdmin();
    const proveedor = await crearProveedor(adminToken);

    await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        sku: 'SKU-STATS',
        nombre: 'Stats',
        precio: 20,
        stock: 1,
        categoria: 'hogar',
        proveedorId: proveedor._id,
      });

    const res = await request(app)
      .get('/api/productos/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.totalProductos).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.porCategoria)).toBe(true);
  });

  test('GET /api/productos/:id inexistente devuelve 404', async () => {
    const adminToken = await crearAdmin();
    const res = await request(app)
      .get('/api/productos/64b000000000000000000000')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(404);
  });
});
