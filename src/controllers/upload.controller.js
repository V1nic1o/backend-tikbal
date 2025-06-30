const cloudinary = require('../config/cloudinary');

exports.subirImagen = async (req, res) => {
  try {
    const files = req.files;

    const urls = await Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'tikbal' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });
      })
    );

    res.json({ urls });
  } catch (err) {
    res.status(500).json({ error: 'Error al subir imágenes' });
  }
};