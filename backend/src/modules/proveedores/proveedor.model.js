const mongoose = require('mongoose');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_HTTP_REGEX = /^https?:\/\/.+/i;
const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const proveedorSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [SLUG_REGEX, 'slug debe ser minúsculas, sin espacios (ej: acme-corp)'],
    },
    contactoEmail: {
      type: String,
      default: null,
      validate: {
        validator: (v) => v === null || v === '' || EMAIL_REGEX.test(v),
        message: 'contactoEmail inválido',
      },
    },
    logoUrl: {
      type: String,
      default: null,
      validate: {
        validator: (v) => v === null || v === '' || URL_HTTP_REGEX.test(v),
        message: 'logoUrl debe ser una URL http(s) válida',
      },
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Proveedor', proveedorSchema);
