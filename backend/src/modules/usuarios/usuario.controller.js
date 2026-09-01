const usuarioService = require('./usuario.service');

async function listar(req, res, next) {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    next(error);
  }
}

async function obtener(req, res, next) {
  try {
    const usuario = await usuarioService.obtenerUsuario(req.params.id);
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const usuario = await usuarioService.crearUsuario(req.body || {});
    res.status(201).json({ msg: 'Usuario creado exitosamente', ...usuario.toJSON() });
  } catch (error) {
    next(error);
  }
}

async function actualizar(req, res, next) {
  try {
    const usuario = await usuarioService.actualizarUsuario(
      req.params.id,
      req.body || {},
      req.usuario
    );
    res.status(200).json({ msg: 'Usuario actualizado exitosamente', ...usuario.toJSON() });
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    await usuarioService.eliminarUsuario(req.params.id, req.usuario);
    res.status(200).json({ msg: 'Usuario eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar };