const authService = require('./auth.service');

async function registrar(req, res, next) {
  try {
    const usuario = await authService.registrar(req.body || {});
    res.status(201).json(usuario);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const data = await authService.login(email, password);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = { registrar, login };
