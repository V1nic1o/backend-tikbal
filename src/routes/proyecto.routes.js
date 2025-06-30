const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/proyecto.controller');
const upload = require('../middlewares/upload');
const verificarToken = require('../middlewares/verificarToken');

router.get('/', ctrl.obtenerProyectos);
router.get('/:id', ctrl.obtenerProyectoPorId); // ✅ Ruta agregada
router.post('/', verificarToken, upload.array('imagenes', 10), ctrl.crearProyecto);
router.put('/:id', verificarToken, upload.array('imagenes', 10), ctrl.actualizarProyecto);
router.delete('/:id', verificarToken, ctrl.eliminarProyecto);

module.exports = router;