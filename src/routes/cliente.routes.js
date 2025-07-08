const express = require('express');
const router = express.Router();
const {
  crearCliente,
  obtenerClientes,
  actualizarCliente,
  eliminarCliente
} = require('../controllers/cliente.controller');

router.post('/', crearCliente);
router.get('/', obtenerClientes);
router.put('/:id', actualizarCliente);
router.delete('/:id', eliminarCliente);

module.exports = router;