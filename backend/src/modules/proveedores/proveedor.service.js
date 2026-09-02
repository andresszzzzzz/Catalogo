const mongoose = require('mongoose');
const proveedorRepository = require('./proveedor.repository');
const AppError = require('../../errors/AppError');


function slugify(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generarSlugUnico(nombre) {
  const base = slugify(nombre) || 'proveedor';
  let candidato = base;
  let sufijo = 2;
  while (await proveedorRepository.porSlug(candidato)) {
    candidato = `${base}-${sufijo}`;
    sufijo += 1;
  }
  return candidato;
}

function clampLimit(limit) {
  const n = Number(limit) || 20;
  return Math.min(Math.max(n, 1), 100);
}

function clampPage(page) {
  const n = Number(page) || 1;
  return Math.max(n, 1);
}

async function listarProveedores(query) {
  const page = clampPage(query.page);
  const limit = clampLimit(query.limit);
  const filtro = {};

  if (query.activo !== undefined) {
    filtro.activo = query.activo === 'true' || query.activo === true;
  }

  const skip = (page - 1) * limit;
  const { data, total } = await proveedorRepository.listar({ filtro, skip, limit });
  return { data, page, limit, total };
}

async function obtenerProveedor(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Identificador inválido', 400, 'ID_INVALIDO');
  }
  const proveedor = await proveedorRepository.porId(id);
  if (!proveedor) {
    throw new AppError('Proveedor no encontrado', 404, 'NO_ENCONTRADO');
  }
  return proveedor;
}

async function crearProveedor(datos) {
  const { nombre, nit, telefono, email, slug: slugManual, logoUrl } = datos;
  if (!nombre) {
    throw new AppError('nombre es requerido', 400, 'VALIDACION');
  }

  const porNombre = await proveedorRepository.porNombre(nombre);
  if (porNombre) {
    throw new AppError('nombre duplicado', 409, 'DUPLICADO');
  }

  let slug;
  if (slugManual) {
    const existentePorSlug = await proveedorRepository.porSlug(slugManual);
    if (existentePorSlug) {
      throw new AppError('nombre o slug duplicado', 409, 'DUPLICADO');
    }
    slug = String(slugManual).toLowerCase();
  } else {
    slug = await generarSlugUnico(nombre);
  }

  return proveedorRepository.crear({
    nombre,
    slug,
    nit: nit ?? '',
    telefono: telefono ?? '',
    email: email ?? null,
    logoUrl: logoUrl ?? null,
  });
}

async function actualizarProveedor(id, datos) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Identificador inválido', 400, 'ID_INVALIDO');
  }

  if (datos.nombre) {
    const existente = await proveedorRepository.porNombre(datos.nombre);
    if (existente && existente._id.toString() !== id) {
      throw new AppError('nombre duplicado', 409, 'DUPLICADO');
    }
  }
  if (datos.slug) {
    const existente = await proveedorRepository.porSlug(datos.slug);
    if (existente && existente._id.toString() !== id) {
      throw new AppError('slug duplicado', 409, 'DUPLICADO');
    }
  }

  const actualizado = await proveedorRepository.actualizar(id, datos);
  if (!actualizado) {
    throw new AppError('Proveedor no encontrado', 404, 'NO_ENCONTRADO');
  }
  return actualizado;
}

async function eliminarProveedor(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Identificador inválido', 400, 'ID_INVALIDO');
  }

  const proveedor = await proveedorRepository.porId(id);
  if (!proveedor) {
    throw new AppError('Proveedor no encontrado', 404, 'NO_ENCONTRADO');
  }

  const productosAsociados = await proveedorRepository.contarProductosDe(id);
  if (productosAsociados > 0) {
    throw new AppError(
      'No se puede eliminar: el proveedor tiene productos asociados. Usa activo:false en su lugar.',
      409,
      'INTEGRIDAD_REFERENCIAL'
    );
  }

  await proveedorRepository.eliminar(id);
}

module.exports = {
  listarProveedores,
  obtenerProveedor,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
};
