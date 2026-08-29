# Estilos de REPFORA

Guía visual del proyecto para replicar su aspecto en otro proyecto **Vue 3 + Quasar**.
Solo contiene la parte visual (CSS, tokens y clases). Todo el CSS de aquí está copiado tal cual del
código actual: `style.css`, `src/quasar-variables.sass` y los bloques `<style scoped>` de los componentes.

**Cómo usarlo:** pega el bloque de tokens y el CSS global en tu `style.css` (enlazado desde `index.html`),
copia `quasar-variables.sass` a `src/` y luego toma solo los bloques de componentes que necesites.

---

## 1. Tokens CSS (`:root`)

Base de toda la identidad visual. Va en el `style.css` global.

```css
:root {
  /* ===== Colors ===== */
  --color_card: #318335;
  --color_text_card: white;
  --color_button: #2e7d32;
  --color_text_button: white;
  --color_box: #2e7d32;
  --color_button_closed: black;
  --color_header: #2e7d32;
  --color_input: #2e7d32;
  --color_tooltip: #d4cece;
}
```

| Token | Valor | Dónde se ve |
|---|---|---|
| `--color_card` | `#318335` | Cabecera de las cards del home y de las card-herramienta |
| `--color_text_card` | `white` | Texto sobre la cabecera de card |
| `--color_button` | `#2e7d32` | Botones primarios, bordes de `section-box`, base de todos los `color-mix` |
| `--color_text_button` | `white` | Texto de botón primario |
| `--color_box` | `#2e7d32` | Bordes y flecha de los tooltips |
| `--color_button_closed` | `black` | Botón en estado cerrado/deshabilitado |
| `--color_header` | `#2e7d32` | Barra superior (`q-header`) |
| `--color_input` | `#2e7d32` | Color de foco/borde de inputs y selects, ítem activo del menú |
| `--color_tooltip` | `#d4cece` | Fondo alternativo de tooltip |

> Cambiando solo `--color_button` y `--color_header` se retiñe casi toda la interfaz, porque los
> componentes nuevos derivan sus fondos con `color-mix()` a partir de `--color_button` (ver §7).

---

## 2. Paleta

### Verdes (color de marca)

| Uso | Hex | Equivalente Quasar |
|---|---|---|
| Verde principal (botones, header, bordes) | `#2e7d32` | `green-9` |
| Verde de cabecera de card | `#318335` | — |
| Verde oscuro (botones de acción secundaria, `hr`) | `#1b5e20` | `green-10` |
| Verde hover / borde activo | `#66bb6a` | `green-5` |
| Verde de fondo suave (hover de card) | `#e8f5e9` | `green-1` |
| Verde de bordes de tabla | `#c8e6c9` | `green-2` |
| Verde de fondo de zona con archivo | `#f1f8e9` | `light-green-1` |
| Fondo de fila par en tablas propias | `#f9fbe7` | `lime-1` |

### Grises y neutros

| Uso | Hex |
|---|---|
| Texto principal | `#212121` / `#111111` |
| Texto de label fuerte | `#424242` |
| Texto secundario / meta | `#616161` / `#555` |
| Bordes de card | `#e0e0e0` |
| Borde punteado de dropzone | `#bdbdbd` |
| Fondo neutro (dropzone, card pendiente) | `#fafafa` |
| Scrollbar thumb | `#bbbbbb` |
| Fondo de contenedor scroll | `#f1f2f3` |

### Clases de color de Quasar realmente usadas

Frecuencia real en `src/` (útil para no inventar tonos nuevos):

```
text-green-9 (131)   text-white (129)     bg-green-9 (93)      text-grey-6 (72)
text-grey-7 (57)     bg-white (56)        text-grey-9 (26)     text-grey-5 (25)
bg-grey-2 (24)       text-grey-8 (23)     bg-blue-grey-1 (22)  text-orange-9 (21)
bg-green-10 (21)     text-green-10 (19)   bg-grey-1 (15)       bg-green-1 (13)
```

Convención práctica:

- **Acción / marca** → `bg-green-9`, `text-green-9`, `color="green-9"`
- **Acento fuerte / botón de vuelta** → `green-10`
- **Texto secundario** → `text-grey-6` / `text-grey-7`
- **Fondo de zonas informativas** → `bg-blue-grey-1`, `bg-grey-1`, `bg-grey-2`
- **Advertencia visual** → `text-orange-9`, `bg-orange-1`
- **Estado vacío** → icono `grey-4` + texto `text-grey-5`

### Estados semánticos

Se usan los colores estándar de Quasar (`positive`, `negative`, `warning`, `info`) definidos en §4.
Las notificaciones del proyecto los aplican así:

| Tipo | Color | Icono | Texto |
|---|---|---|---|
| Error | `negative` (`#C10015`) | `error` | blanco |
| Éxito | `positive` (`#21BA45`) | `check` | blanco |
| Advertencia | `warning` (`#F2C037`) | `warning` | negro |

---

## 3. Variables de Quasar

Archivo `src/quasar-variables.sass` (se referencia desde `vite.config.js` con
`quasar({ sassVariables: "src/quasar-variables.sass" })`):

```sass
$primary   : #1976D2
$secondary : #26A69A
$accent    : #9C27B0

$dark      : #1D1D1D

$positive  : #21BA45
$negative  : #C10015
$info      : #31CCEC
$warning   : #F2C037
```

> Ojo: `$primary` sigue siendo el azul por defecto de Quasar. El verde de marca **no** pasa por
> `primary`, se aplica siempre con `bg-green-9` / `text-green-9` o con los tokens `--color_*`.
> Si quieres que el verde sea el primario en el proyecto nuevo, cambia `$primary: #2e7d32`.

---

## 4. Tipografía y escala

| Elemento | Estilo |
|---|---|
| Título de vista | `text-h4` + `text-weight-bold` + `.style-text`, seguido de `<hr class="bg-green-9">` de `width: 83%; height: 2px` |
| Título de card | `text-h6` + `.style-text` (capitalize) |
| Título de diálogo | `.dialog-title` sobre fondo `bg-green-9`, blanco y bold |
| Subtítulo de diálogo | `text-caption` en `text-green-2` |
| Título de reporte | `.titleReport` → `26px / 600` |
| Título de sección | `.section-box__title` → `13–15px`, `800`, uppercase, `letter-spacing: 1–1.1px` |
| Label de dato | `.data-label` → `13px`, `700`, uppercase, `letter-spacing: .5px`, borde izquierdo verde |
| Valor de dato | `.data-value` → `16px`, `#111111`, `line-height: 1.5` |
| Meta / secundario | `12–16px` en `#616161` o `text-grey-6/7` |
| Celda de tabla | header `13px / 600`, cuerpo `14px` |
| Badge / chip | `9–13px`, uppercase, `letter-spacing: .3–.5px` |
| Footer | `text-h6 text-weight-bold text-subtitle1` centrado sobre `bg-grey-4 text-black` |

Utilidad de texto global:

```css
.style-text {
  text-transform: capitalize !important;
}
```

Fuente: la de Quasar por defecto (Roboto) + iconos `material-icons` y `material-symbols-outlined`.

---

## 5. Componentes visuales

### 5.1 Header / drawer / footer

```css
/* Barra superior — se oculta en login y registro público */
.header {
  background-color: var(--color_header);
}

.hide-menu {
  display: none;
}

.btnSlider:hover {
  background-color: transparent !important;
}
```

Ítem del menú lateral (clases inline en el `q-item`):

```
class="bg-green-9 text-white q-mb-md"
style="border-radius: 12px; width: 230px"
```

Área de scroll del drawer, con el bloque de logo/rol arriba:

```css
/* q-scroll-area */
height: calc(100% - 150px);
margin-top: 150px;
border-right: 1px solid #ddd;
/* la q-img superior ocupa height: 150px, class="absolute-top bg-grey-2 text-center" */
```

Ítem activo del router:

```css
.q-item.q-router-link--active,
.q-item--active {
  color: var(--color_input) !important;
}
```

Footer: `class="bg-grey-4 text-black"` con el texto centrado.

---

### 5.2 Card de módulo (home)

Card con cabecera verde, imagen 4:3 al 50% y botón "VER".

```css
.card_style {
  background-color: var(--color_card) !important;
  color: var(--color_text_card);
}

.img-card {
  display: flex;
  width: 50% !important;
  aspect-ratio: 4/3 !important;
  object-fit: cover;
  max-width: 50% !important;
  border: 0;
}

.button_style {
  background-color: var(--color_button);
  color: var(--color_text_button);
}
```

La `q-card` lleva `class="my-card-1 text-center shadow-5 full-width"` y el grid del home usa
`col-10 col-sm-6 col-md-4 col-lg-3`.

Badge flotante "EN PRUEBAS":

```
color="deep-orange-9" text-color="white" floating
class="q-pa-xs text-weight-bold"
style="font-size: 10px; top: 12px; right: 12px; z-index: 10;"
```

---

### 5.3 Botones

```css
/* Botón primario global */
.style-btn {
  background-color: var(--color_button) !important;
  color: var(--color_text_button) !important;
}

/* Botón de guardar en diálogos */
.save_as {
  font-size: 18px;
  background-color: var(--color_button);
  color: var(--color_text_button);
}

/* Anchos mínimos de los botones de diálogo */
.btn-cancel { min-width: 120px; }
.btn-ok     { min-width: 220px; }

/* Acción secundaria en tablas (iconos) */
.action-secondary {
  opacity: 0.85;
  transition: all 0.2s ease;
}
.action-secondary:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05) !important;
  transform: scale(1.1);
}
```

Botones Quasar: `color="green-9" unelevated` para la acción principal, `flat color="dark"` para cancelar.
Botón de volver: `q-page-sticky position="top-left" :offset="[20, 20]"` con
`icon="arrow_back" color="green-10" size="12px" round`.

---

### 5.4 Card-herramienta y card de ítem

Cards de la vista de complementarias, con hover verde.

```css
.card-herramienta {
  border-radius: 8px;
  transition: background 0.18s ease, border-color 0.18s ease;
  border: 1px solid #e0e0e0;
  min-height: 260px;
}
.card-hover {
  background-color: #e8f5e9;
  border-color: #66bb6a;
}
.card-pendiente {
  background: #fafafa;
}
.card-header {
  background-color: var(--color_card);
  border-radius: 8px 8px 0 0;
}
.card-title {
  font-size: 1.1rem;
  letter-spacing: 0.3px;
}
.card-badge {
  font-size: 9px;
  letter-spacing: 0.5px;
  border-radius: 20px;
  padding: 2px 8px;
}
```

```css
.item-card {
  border-radius: 8px;
  cursor: default;
  transition: background 0.18s ease;
  border: 1px solid #e0e0e0;
}
.item-card.hover-active {
  background-color: #66bb6a;
  border-color: #66bb6a;
}
.item-badge {
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}
.item-title {
  font-size: 20px;
  font-weight: bold;
  color: var(--color_card);
  line-height: 1.4;
}
.meta-item {
  font-size: 16px;
  color: #616161;
}
.meta-code {
  color: var(--color_button);
  font-weight: 600;
}
.arrow-btn {
  width: 40px;
  height: 40px;
}
```

Card de resultado con elevación al pasar el mouse:

```css
.result-card {
  border-radius: 8px;
  transition: box-shadow .15s ease, transform .15s ease;
}
.result-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, .12);
  transform: translateY(-1px);
}
```

---

### 5.5 Section box (bloque de contenido con título)

El patrón más repetido en los diálogos: caja con borde verde suave y cabecera en mayúsculas.

```css
.section-box {
  border: 1.5px solid color-mix(in srgb, var(--color_button) 35%, transparent);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.section-box__title {
  background-color: color-mix(in srgb, var(--color_button) 10%, white);
  color: var(--color_button);
  font-size: 15px;          /* 13px en diálogos densos */
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.1px;
  padding: 11px 16px;
  border-bottom: 3px solid var(--color_button);
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.section-content-centered { flex: 1; align-content: center; row-gap: 32px; }

/* Par label/valor dentro de la caja */
.data-label {
  font-size: 13px;
  font-weight: 700;
  color: #424242;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
  padding-left: 8px;
  border-left: 3px solid var(--color_button);
}
.data-value { font-size: 16px; color: #111111; line-height: 1.5; }
```

Cabecera de sección plegable (expansion):

```css
.section-card { border-radius: 8px; }
.section-title { font-size: 18px; }
.section-header {
  background-color: color-mix(in srgb, var(--color_button) 10%, white);
  transition: background 0.2s;
}
.section-header:hover {
  background-color: color-mix(in srgb, var(--color_button) 20%, white);
}
```

---

### 5.6 Diálogos

Tamaños estándar de `.dialog-card` según el tipo de diálogo:

```css
/* Formulario pequeño */
.dialog-card { width: 520px; max-width: 95vw; }

/* Formulario mediano */
.dialog-card { width: 700px; max-width: 95vw; }

/* Diálogo de detalle a pantalla casi completa */
.dialog-card { width: 90vw; height: 90vh; max-width: 90vw; max-height: 90vh; }

/* Diálogo maestro-detalle (el más grande) */
.dialog-card {
  width: 98vw;
  max-width: 1600px;
  height: 95vh;
  min-width: 320px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dialog-body { overflow-y: auto; }
.dialog-scroll-area { flex: 1; min-height: 0; }

/* Chips de la cabecera del diálogo */
.dialog-badge { font-size: 13px; padding: 4px 12px; border-radius: 20px; }
.dialog-badge--wide { padding: 4px 14px; }
.course-code { letter-spacing: 1.4px; font-size: 13px; }
.course-name { font-size: 22px; line-height: 1.3; }
```

Cabecera de diálogo (estructura visual): `q-card-section` con
`class="bg-green-9 q-px-lg q-py-md no-shrink"`, icono blanco de 28px, título blanco bold `.dialog-title`,
subtítulo `text-green-2 text-caption` y `q-btn flat round icon="close" color="white"` a la derecha.

Panel lateral de diálogos maestro-detalle:

```css
.panel-left {
  width: 280px;
  min-width: 240px;
  max-width: 320px;
  border-right: 1px solid #c8e6c9;
  overflow-y: auto;
  background: color-mix(in srgb, var(--color_button) 5%, white);
}
.panel-right {
  background: #fff;
}
.seccion-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--color_button);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  display: flex;
  align-items: center;
}
.reporte-item {
  border-radius: 8px !important;
  transition: background 0.15s;
}
.reporte-activo {
  background: var(--color_button) !important;
}
```

Estado vacío y cargando (visual): icono `inbox` de 64px en `grey-4`, texto `.empty-title` en `text-grey-5`,
spinners `q-spinner-dots` / `q-spinner-gears` en `color="green-9"`.

---

### 5.7 Tablas

Tabla Quasar con cabecera fija (la de uso general, 29 apariciones):

```css
.my-sticky-header-table {
  /* height or max-height is important */
  height: 60vh;
}

.my-sticky-header-table .q-table__top,
.my-sticky-header-table .q-table__bottom,
.my-sticky-header-table thead tr:first-child th {
  background-color: white;
  color: black;
  font-weight: 600;
  font-size: 13px;
}

.my-sticky-header-table tbody td {
  font-size: 14px;
}

.my-sticky-header-table thead tr th {
  position: sticky;
  z-index: 1;
}

.my-sticky-header-table thead tr:first-child th {
  top: 0;
}

/* this is when the loading indicator appears */
.my-sticky-header-table.q-table--loading thead tr:last-child th {
  /* height of all previous header rows */
  top: 48px;
}

/* prevent scrolling behind sticky top row on focus */
.my-sticky-header-table tbody {
  /* height of all previous header rows */
  scroll-margin-top: 48px;
}
```

Variante más alta (`70vh`, sin cambio de tipografía):

```css
.my-sticky-header-table2 {
  height: 70vh;
}

.my-sticky-header-table2 .q-table__top,
.my-sticky-header-table2 .q-table__bottom,
.my-sticky-header-table2 thead tr:first-child th {
  background-color: white;
  color: black;
}

.my-sticky-header-table2 thead tr th {
  position: sticky;
  z-index: 1;
}

.my-sticky-header-table2 thead tr:first-child th {
  top: 0;
}

.my-sticky-header-table2.q-table--loading thead tr:last-child th {
  top: 48px;
}

.my-sticky-header-table2 tbody {
  scroll-margin-top: 48px;
}
```

Overrides globales de tabla:

```css
.q-table__top {
  padding: 0px !important;
  margin: 0px !important;
}

.table-reactive {
  height: 1000px !important;
}
```

Tabla HTML propia (sin Quasar), cabecera verde y filas alternas:

```css
.sess-view-table          { width: 100%; border-collapse: collapse; font-size: 13px; }
.sess-view-table thead tr { background-color: var(--color_button); color: var(--color_text_button); }
.sess-view-table th       { padding: 7px 8px; text-align: center; font-weight: 700; font-size: 12px; letter-spacing: 0.3px; }
.sess-view-table td       { padding: 6px 8px; text-align: center; border: 1px solid #c8e6c9; }
.sess-view-table .row-even td { background-color: #f9fbe7; }
.sess-view-table .row-odd  td { background-color: #fff; }
.resultado-cell { font-size: 11px; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
```

Texto truncado en celdas:

```css
.resumen-fila {
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.label-news {
  word-wrap: break-word;
}
```

En las `q-table` se usa `flat bordered` y `rows-per-page-label="Registros por página"`.

---

### 5.8 Chips, badges y banners

```css
/* Chip de requisito / ítem numerado */
.req-chip {
  display: flex;
  align-items: flex-start;
  background-color: color-mix(in srgb, var(--color_button) 6%, white);
  border: 1px solid color-mix(in srgb, var(--color_button) 20%, transparent);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;         /* 16px en la versión destacada */
  color: #212121;
  line-height: 1.45;
}
.req-chip__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: color-mix(in srgb, var(--color_button) 20%, white);
  color: var(--color_button, #2E7D32);
  font-size: 11px;
  font-weight: 700;
  margin-right: 10px;
  flex-shrink: 0;
}
.req-chip__icon { margin-right: 8px; margin-top: 1px; flex-shrink: 0; }
.req-chip__text { flex: 1; }

/* Chip de resultado de una operación */
.result-chip {
  display: flex;
  align-items: center;
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 500;
}
```

Banner de "última actualización" (borde izquierdo verde):

```css
.ultima-actualizacion {
  display: flex;
  align-items: center;
  gap: 10px;
  background: color-mix(in srgb, var(--color_button) 8%, white);
  border: 1px solid color-mix(in srgb, var(--color_button) 35%, transparent);
  border-left: 4px solid var(--color_button);
  border-radius: 6px;
  padding: 10px 12px;
}
.ultima-icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color_button);
  flex-shrink: 0;
}
.ultima-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--color_button);
  letter-spacing: 0.6px;
}
.ultima-fecha {
  font-size: 12px;
  font-weight: 500;
  color: var(--color_card);
  margin-top: 2px;
}
```

Punto de color (leyenda de calendario):

```css
.color-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
```

Los `q-banner` de aviso usan pares tono-1 / tono-10, p. ej. `class="bg-purple-1 text-purple-10 rounded-borders"`
con el botón de acción en `color="purple-9"`.

---

### 5.9 Zona de carga de archivos (drag & drop)

Versión con estados `active` / `has-file`:

```css
.drop-area {
  min-height: 200px;
  border: 3px dashed #bdbdbd;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 28px 20px;
  transition: border-color 0.2s, background 0.2s;
  background: #fafafa;
}
.drop-area.active   { background-color: #e8f5e9; border-color: #43a047; }
.drop-area.has-file { border-color: #66bb6a;     background-color: #f1f8e9; }
.drop-text {
  font-size: 15px;
  font-weight: 500;
  color: #555;
}
.file-info {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 13px;
}
```

Versión tematizada con `color-mix` (más integrada con la marca):

```css
.formacion-dropzone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 16px;
  border: 2px dashed color-mix(in srgb, var(--color_button, #2e7d32) 40%, transparent);
  border-radius: 10px;
  background-color: color-mix(in srgb, var(--color_button, #2e7d32) 4%, white);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}
.formacion-dropzone:hover {
  border-color: color-mix(in srgb, var(--color_button, #2e7d32) 70%, transparent);
  background-color: color-mix(in srgb, var(--color_button, #2e7d32) 8%, white);
}
.formacion-dropzone--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.formacion-dropzone__input {
  display: none;
}
```

Tarjeta de contenido asociada:

```css
.competencia-card {
  border-color: color-mix(in srgb, var(--color_button) 30%, transparent);
  background-color: color-mix(in srgb, var(--color_button) 4%, white);
  border-radius: 8px;
  overflow: hidden;
}
.competencia-header {
  background-color: color-mix(in srgb, var(--color_button) 8%, white);
}
.competencia-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #616161;
  margin-bottom: 4px;
}
.competencia-name {
  font-size: 15px;
  font-weight: 600;
  color: #212121;
  line-height: 1.45;
}
```

---

### 5.10 Tooltips

Tooltip propio con flecha CSS:

```css
.tooltip {
  position: relative;
}

.open-tooltip {
  color: var(--color_box);
  font-weight: 800;
  text-transform: uppercase;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.open-tooltip:hover {
  opacity: 0.7;
}

.content-tooltip {
  width: 300px;
  background: #fff;
  padding: 10px;
  position: absolute;
  top: 80%;
  left: -40%;
  border-radius: 5px;
  visibility: hidden;
  opacity: 0;
  transition: 0.2s;
  z-index: 1;
  border: 2px solid var(--color_box);
}

.content-tooltip .h-tooltip {
  font-size: 18px;
  text-transform: capitalize;
  font-weight: 900;
}

.content-tooltip .p-tooltip {
  line-height: 1.4;
}

/* Flecha del tooltip */
.content-tooltip::before {
  content: "";
  position: absolute;
  width: 25px;
  height: 25px;
  background: #fff;
  top: 0;
  left: 50%;
  border-radius: 0px;
  border: 2px solid;
  border-color: var(--color_box) transparent transparent var(--color_box);
  transform: translate(-50%, -50%) rotate(45deg);
}

.tooltip:hover .content-tooltip {
  visibility: visible;
  opacity: 1;
  z-index: 1;
}

/* Tooltip de eventos del calendario */
.content-tooltip-event {
  padding: 6px 12px;
  width: 220px;
  overflow: hidden;
  font-size: 12px;
  height: 310px;
  overflow-y: auto;
  background-color: #fffadf;
}
```

Tema de `floating-vue` (popper):

```css
.v-popper--theme-menu .v-popper__inner {
  background: #fff;
  color: black;
  border-radius: 6px;
  border: 1px solid #373737 !important;
  box-shadow: 0 6px 30px rgba(0, 0, 0, .1);
}

.v-popper--theme-menu .v-popper__arrow-inner {
  visibility: hidden;
  border-color: #3a3a3a !important;
}

.v-popper--theme-menu .v-popper__arrow-outer {
  border-color: #242424 !important;
}

/* Transition */
.v-popper--theme-my-theme.v-popper__popper--hidden {
  visibility: hidden;
  opacity: 0;
  transition: opacity .15s, visibility .15s;
}

.v-popper--theme-my-theme.v-popper__popper--shown {
  visibility: visible;
  opacity: 1;
  transition: opacity .15s;
}

.v-popper--theme-my-theme.v-popper__popper--skip-transition {
  transition: none !important;
}
```

---

### 5.11 Calendario (FullCalendar)

```css
.calendar-wrapper {
  width: 100%;
  min-height: 425px;
}
.event-content {
  padding: 2px 5px;
  cursor: grab;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.event-content:active { cursor: grabbing; }
.event-content.event-existing { cursor: pointer; }
.event-content.event-existing:active { cursor: pointer; }
.event-hours {
  font-size: 11px;
  font-weight: 500;
  line-height: 1.3;
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.event-time {
  font-size: 10px;
  font-weight: 900;
  opacity: 1;
  line-height: 1.2;
}
.event-content:not(.event-existing) .event-hours { font-weight: 700; }
.event-content:not(.event-existing) .event-time  { font-size: 11px; }

:deep(.is-existing-event)       { opacity: 0.75 !important; }
:deep(.is-existing-event:hover) { opacity: 0.9 !important; }
:deep(.is-new-event) {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3) !important;
  z-index: 2;
}
:deep(.fc-event) {
  border-radius: 6px !important;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18) !important;
  transition: opacity 0.15s, box-shadow 0.15s !important;
}
:deep(.fc-event:hover) {
  opacity: 0.88;
  box-shadow: 0 3px 8px rgba(56, 142, 60, 0.35) !important;
}
:deep(.fc-event.fc-event-dragging) {
  opacity: 0.7;
  box-shadow: 0 6px 16px rgba(56, 142, 60, 0.4) !important;
}
:deep(.fc-daygrid-event)      { margin-top: 2px !important; }
:deep(.fc-daygrid-day-frame)  { min-height: 110px; }
:deep(.fc-event-dashed) {
  border-style: dashed !important;
  border-width: 2px !important;
}
```

Tamaño máximo del calendario y truncado de eventos (globales):

```css
.maxSizeCalender {
  width: 1500px !important;
  height: 800px !important;
}

.customEvents {
  white-space: nowrap;
  text-overflow: ellipsis !important;
  overflow: hidden;
}
```

---

### 5.12 Inputs y selects

```css
.style-select {
  color: var(--color_input) !important;
  border-color: var(--color_input) !important;
  outline-color: var(--color_input) !important;
}

.q-field__control {
  color: var(--color_input) !important;
}
```

Patrón visual de los campos en filtros y formularios:

- `q-input` / `q-select` con `outlined dense clearable color="green-9"`
- Icono en el slot `prepend` (`search`, `sort`, `fact_check`…)
- Grid de filtros: `row q-col-gutter-sm q-mb-md` + `col-12 col-sm-6`
- Radios de filtro: `color="green-7"` con `checked-icon="task_alt"` / `unchecked-icon="panorama_fish_eye"`
- Badge de conteo junto al filtro: `color="green-2" text-color="green-9"`
- Botón de limpiar: `flat dense icon="filter_alt_off" color="green-9" size="sm"`

---

### 5.13 Scrollbars y contenedor con scroll

```css
.contenedor {
  margin: 2rem auto;
  border: 1px solid #aaa;
  height: 300px;
  width: 90%;
  max-width: 400px;
  background: #f1f2f3;
  overflow: auto;
  box-sizing: border-box;
  padding: 0 1rem;
}

/* Estilos para motores Webkit y blink (Chrome, Safari, Opera...) */

::-webkit-scrollbar {
  -webkit-appearance: none;
}

::-webkit-scrollbar:vertical {
  width: 12px;
}

::-webkit-scrollbar-button:increment,
::-webkit-scrollbar-button {
  display: none;
}

::-webkit-scrollbar:horizontal {
  height: 12px;
}

::-webkit-scrollbar-thumb {
  background-color: #bbbbbb;
  border-radius: 5px;
  border: 2px solid #f1f2f3;
}

::-webkit-scrollbar-track {
  border-radius: 5px;
}
```

---

### 5.14 Título de reporte

```css
.titleReport {
  font-size: 26px;
  font-weight: 600;
}
```

---

## 6. Convención `color-mix`

Es el recurso más usado en los componentes nuevos: en vez de añadir tokens para cada tono, se derivan
fondos y bordes suaves a partir de `--color_button`. Escala real en uso:

| Mezcla | Resultado | Uso |
|---|---|---|
| `color-mix(in srgb, var(--color_button) 4%, white)` | verde casi blanco | Fondo de card de contenido, dropzone |
| `... 5%, white` | verde muy suave | Fondo de panel lateral |
| `... 6%, white` | verde suave | Fondo de chip |
| `... 8%, white` | verde claro | Fondo de banner, cabecera de sub-card |
| `... 10%, white` | verde claro | Fondo de título de sección y de cabecera plegable |
| `... 20%, white` | verde medio | Hover de cabecera, círculo numerado |
| `... 20%, transparent` | borde tenue | Borde de chip |
| `... 30%, transparent` | borde suave | Borde de card |
| `... 35%, transparent` | borde visible | Borde de `section-box` y de banner |
| `... 40%, transparent` | borde punteado | Dropzone en reposo |
| `... 70%, transparent` | borde marcado | Dropzone en hover |

Regla práctica: **fondos se mezclan con `white`, bordes con `transparent`**. Así, al cambiar
`--color_button` el sistema completo se retiñe de forma coherente.

En los componentes más nuevos se escribe con fallback (`var(--color_button, #2e7d32)`) para que el
bloque funcione aunque el token no esté cargado — recomendable al copiarlos a otro proyecto.

---

## 7. Notas de portabilidad

**Funciona tal cual en cualquier proyecto (CSS puro):**
tokens `:root`, `.style-btn`, `.style-text`, tooltips, scrollbars, `.sess-view-table`, `.drop-area`,
`.formacion-dropzone`, `.section-box`, `.req-chip`, `.card-herramienta`, `.item-card`, `.dialog-card`,
`.titleReport` y toda la convención `color-mix`.

**Depende de Quasar:**

- Clases utilitarias `bg-*` / `text-*` / `q-pa-*` / `q-mb-*` / `q-col-gutter-*` / `col-*`
- Selectores sobreescritos: `.q-field__control`, `.q-item--active`, `.q-table__top`, `.q-table__bottom`,
  `.q-table--loading`, y por tanto `.my-sticky-header-table` y `.my-sticky-header-table2`
- Componentes `q-header`, `q-drawer`, `q-footer`, `q-card`, `q-dialog`, `q-table`, `q-banner`, `q-chip`

**Depende de otras librerías:**

- `.v-popper--theme-*` → `floating-vue` (requiere importar `floating-vue/dist/style.css`)
- `:deep(.fc-*)` y `.maxSizeCalender` → FullCalendar

**Assets visuales referenciados** (hay que copiarlos o sustituirlos):

- `/images/LOGO-SENA.png` — avatar del drawer
- `/images/logo-blanco.png` — logo del header para el rol público
- `/src/assets/logo.ico` — favicon
- `/images/*.png|jpg` — imágenes de las cards del home (una por módulo, ratio 4:3)

**Enganche del CSS global:** `style.css` se carga desde `index.html` con
`<link rel="stylesheet" href="style.css" />`, no desde `main.js`. Los iconos vienen de
`@quasar/extras/material-icons` y `material-symbols-outlined`.
