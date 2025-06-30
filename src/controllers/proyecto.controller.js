const { Proyecto } = require('../models');
const cloudinary = require('../config/cloudinary');

// 🟢 Obtener todos los proyectos
exports.obtenerProyectos = async (req, res) => {
  const proyectos = await Proyecto.findAll({ order: [['createdAt', 'DESC']] });
  res.json(proyectos);
};

// 🟢 Obtener proyecto por ID
exports.obtenerProyectoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const proyecto = await Proyecto.findByPk(id);
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
    res.json(proyecto);
  } catch (err) {
    console.error('Error al obtener proyecto por ID:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 🟢 Crear un nuevo proyecto
exports.crearProyecto = async (req, res) => {
  try {
    const { nombre, cliente, ubicacion, descripcion } = req.body;
    const archivos = req.files || [];

    const urls = await Promise.all(
      archivos.map(file =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'tikbal/proyectos' },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        })
      )
    );

    const nuevo = await Proyecto.create({
      nombre,
      cliente,
      ubicacion,
      descripcion,
      imagenes: urls,
    });

    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
};

// 🟢 Actualizar proyecto
exports.actualizarProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cliente, ubicacion, descripcion, imagenesActuales } = req.body;
    const archivos = req.files || [];

    const proyecto = await Proyecto.findByPk(id);
    if (!proyecto) return res.status(404).json({ error: 'No encontrado' });

    let nuevasImagenes = [];
    if (imagenesActuales) {
      nuevasImagenes = JSON.parse(imagenesActuales);
    }

    if (archivos.length > 0) {
      const nuevasUrls = await Promise.all(
        archivos.map(file =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'tikbal/proyectos' },
              (err, result) => {
                if (err) reject(err);
                else resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          })
        )
      );
      nuevasImagenes = [...nuevasImagenes, ...nuevasUrls];
    }

    Object.assign(proyecto, {
      nombre,
      cliente,
      ubicacion,
      descripcion,
      imagenes: nuevasImagenes,
    });

    await proyecto.save();

    res.json(proyecto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
};

// 🟢 Eliminar proyecto
exports.eliminarProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    await Proyecto.destroy({ where: { id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
};