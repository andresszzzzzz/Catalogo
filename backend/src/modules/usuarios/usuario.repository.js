const Usuario = require('../auth/usuario.model');

function listar() {
  return Usuario.find().sort({ createdAt: -1 });
}

function porId(id) {
  return Usuario.findById(id);
}

function porEmail(email) {
  return Usuario.findOne({ email: String(email).toLowerCase() });
}

function crear(datos) {
  return Usuario.create(datos);
}

async function actualizar(id, datos) {
  const usuario = await Usuario.findById(id);
  if (!usuario) return null;
  Object.assign(usuario, datos);
  await usuario.save();
  return usuario;
}

function eliminar(id) {
  return Usuario.findByIdAndDelete(id);
}

function contarAdmins(excluirId) {
  const filtro = { rol: 'admin' };
  if (excluirId) filtro._id = { $ne: excluirId };
  return Usuario.countDocuments(filtro);
}

module.exports = { listar, porId, porEmail, crear, actualizar, eliminar, contarAdmins };