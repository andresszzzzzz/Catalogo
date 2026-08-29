const mongoose = require('mongoose');

const URL_HTTP_REGEX = /^https?:\/\/.+/i;

const productoSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    nombre: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
    },
    precio: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    categoria: {
      type: String,
      required: true,
      minlength: 1,
      trim: true,
      lowercase: true,
      index: true,
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
    proveedorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proveedor',
      required: true,
      index: true,
    },
    disponible: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// disponible se deriva siempre de stock, sin importar quién escriba el doc.
productoSchema.pre('validate', function derivarDisponible(next) {
  this.disponible = (this.stock || 0) > 0;
  next();
});

module.exports = mongoose.model('Producto', productoSchema);
