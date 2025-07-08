const { Cliente } = require('../models');

const crearCliente = async (req, res) => {
  try {
    const nuevoCliente = await Cliente.create(req.body);
    res.status(201).json(nuevoCliente);
  } catch (err) {
    console.error('Error al crear cliente:', err);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
};

const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({ order: [['createdAt', 'DESC']] });
    res.json(clientes);
  } catch (err) {
    console.error('Error al obtener clientes:', err);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await Cliente.update(req.body, { where: { id } });
    res.json({ mensaje: 'Cliente actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar cliente:', err);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await Cliente.destroy({ where: { id } });
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar cliente:', err);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
};

module.exports = {
  crearCliente,
  obtenerClientes,
  actualizarCliente,
  eliminarCliente
};