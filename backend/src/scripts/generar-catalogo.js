/**
 * Genera un archivo CSV de prueba con >=120.000 filas "sucias" para probar
 * el import masivo (Fase 2+). Uso: node src/scripts/generar-catalogo.js [filas] [salida]
 */
const fs = require('fs');
const path = require('path');

const FILAS = Number(process.argv[2]) || 120000;
const SALIDA = process.argv[3] || path.join(process.cwd(), 'catalogo-prueba.csv');

const CATEGORIAS = ['ropa', 'Ropa', 'hogar', 'Hogar', 'electronica', 'Electronica', 'juguetes'];

function filaAleatoria(i) {
  const sucio = i % 7 === 0;
  const sku = `SKU-${String(i).padStart(6, '0')}`;
  const nombre = sucio ? `  Producto   ${i}  ` : `Producto ${i}`;
  const precio = sucio ? (Math.random() * 500).toFixed(4) : (Math.random() * 500).toFixed(2);
  const stock = sucio && i % 21 === 0 ? -1 : Math.floor(Math.random() * 200);
  const categoria = CATEGORIAS[i % CATEGORIAS.length];
  const descripcion = i % 5 === 0 ? '' : `Descripción del producto ${i}`;
  const imagenUrl = i % 11 === 0 ? 'no-es-una-url' : `https://cdn.demo.com/img/${sku}.jpg`;

  // Algunas filas con campos vacíos u omitidos a propósito.
  if (i % 13 === 0) return `${sku},,${precio},${stock},${categoria},${descripcion},${imagenUrl}`;
  if (i % 17 === 0) return `${sku},${nombre},,${stock},${categoria},${descripcion},${imagenUrl}`;

  return `${sku},${nombre},${precio},${stock},${categoria},${descripcion},${imagenUrl}`;
}

function generar() {
  const stream = fs.createWriteStream(SALIDA);
  stream.write('sku,nombre,precio,stock,categoria,descripcion,imagenUrl\n');

  for (let i = 1; i <= FILAS; i += 1) {
    stream.write(`${filaAleatoria(i)}\n`);
    // Duplicados intencionales cada 500 filas para probar la validación.
    if (i % 500 === 0) {
      stream.write(`${filaAleatoria(i)}\n`);
    }
  }

  stream.end(() => {
    // eslint-disable-next-line no-console
    console.log(`[generar-catalogo] ${FILAS} filas escritas en ${SALIDA}`);
  });
}

generar();
