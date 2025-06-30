const { Mensaje } = require('../models');

exports.obtenerMensajes = async (req, res) => {
  const mensajes = await Mensaje.findAll({ order: [['createdAt', 'DESC']] });
  res.json(mensajes);
};

exports.crearMensaje = async (req, res) => {
  try {
    const { nombre, correo, mensaje } = req.body;
    const nuevo = await Mensaje.create({ nombre, correo, mensaje });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear mensaje' });
  }
};

exports.eliminarMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    await Mensaje.destroy({ where: { id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar mensaje' });
  }
};