const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/servicio.controller');
const upload = require('../middlewares/upload');
const verificarToken = require('../middlewares/verificarToken');

router.get('/', ctrl.obtenerServicios);
router.post('/', verificarToken, upload.array('imagenes', 10), ctrl.crearServicio);
router.put('/:id', verificarToken, upload.array('imagenes', 10), ctrl.actualizarServicio);
router.delete('/:id', verificarToken, ctrl.eliminarServicio);

module.exports = router;