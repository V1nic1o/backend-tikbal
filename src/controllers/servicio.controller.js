const { Servicio } = require('../models');
const cloudinary = require('../config/cloudinary');

// 🟢 Obtener todos los servicios
exports.obtenerServicios = async (req, res) => {
  const servicios = await Servicio.findAll({ order: [['createdAt', 'DESC']] });
  res.json(servicios);
};

// 🟢 Crear un nuevo servicio con imágenes
exports.crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const archivos = req.files || [];

    // Subir nuevas imágenes a Cloudinary
    const urls = await Promise.all(
      archivos.map(file =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'tikbal/servicios' },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        })
      )
    );

    const nuevo = await Servicio.create({
      nombre,
      descripcion,
      imagenes: urls,
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
};

// 🟢 Actualizar un servicio, manteniendo y agregando imágenes en orden
exports.actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, imagenesActuales } = req.body;
    const archivos = req.files || [];

    const servicio = await Servicio.findByPk(id);
    if (!servicio) return res.status(404).json({ error: 'No encontrado' });

    // 1. Parsear las imágenes actuales (en orden)
    let imagenesFinal = [];
    if (imagenesActuales) {
      imagenesFinal = JSON.parse(imagenesActuales); // viene como JSON string desde el frontend
    }

    // 2. Subir nuevas imágenes
    if (archivos.length > 0) {
      const nuevasUrls = await Promise.all(
        archivos.map(file =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'tikbal/servicios' },
              (err, result) => {
                if (err) reject(err);
                else resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          })
        )
      );
      imagenesFinal = [...imagenesFinal, ...nuevasUrls];
    }

    // 3. Actualizar datos
    Object.assign(servicio, {
      nombre,
      descripcion,
      imagenes: imagenesFinal,
    });

    await servicio.save();

    res.json(servicio);
  } catch (err) {
    console.error('Error al actualizar servicio:', err);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
};

// 🟢 Eliminar un servicio
exports.eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    await Servicio.destroy({ where: { id } });
    res.sendStatus(204);
  } catch (err) {
    console.error('Error al eliminar servicio:', err);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
};