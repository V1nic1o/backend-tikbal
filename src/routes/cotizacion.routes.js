const express = require('express');
const router = express.Router();
const {
  crearCotizacion,
  obtenerCotizaciones,
  descargarPDF,
  actualizarEstado,
  editarCotizacion,
  eliminarCotizacion
} = require('../controllers/cotizacion.controller');

router.post('/', crearCotizacion);
router.get('/', obtenerCotizaciones);
router.get('/pdf/:id', descargarPDF);
router.put('/estado/:id', actualizarEstado);
router.put('/:id', editarCotizacion);
router.delete('/:id', eliminarCotizacion);

module.exports = router;