const express = require('express');
const router = express.Router();
const {
  crearCotizacion,
  obtenerCotizaciones,
  descargarPDF,
  descargarPDFDirecto, // ✅ nueva función para descarga automática
  actualizarEstado,
  editarCotizacion,
  eliminarCotizacion
} = require('../controllers/cotizacion.controller');

router.post('/', crearCotizacion);
router.get('/', obtenerCotizaciones);
router.get('/pdf/:id', descargarPDF);

// ✅ NUEVA RUTA: descarga automática forzada con nombre del cliente
router.get('/descargar/:id', descargarPDFDirecto);

router.put('/estado/:id', actualizarEstado);
router.put('/:id', editarCotizacion);
router.delete('/:id', eliminarCotizacion);

module.exports = router;