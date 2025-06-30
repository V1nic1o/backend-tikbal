const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/mensaje.controller');
const verificarToken = require('../middlewares/verificarToken');

router.get('/', verificarToken, ctrl.obtenerMensajes);
router.post('/', ctrl.crearMensaje); // público desde el sitio
router.delete('/:id', verificarToken, ctrl.eliminarMensaje);

module.exports = router;