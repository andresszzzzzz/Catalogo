const mongoose = require('mongoose');

const URL_HTTP_REGEX = /^https?:\/\/.+/i;

const categoriaSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      default: null,
    },
    imagenUrl: {
      type: String,
      default: null,
      validate: {
        validator: (v) => v === null || v === '' || URL_HTTP_REGEX.test(v),
        message: 'imagenUrl debe ser una URL http(s) válida',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Categoria', categoriaSchema);
