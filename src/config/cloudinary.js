// src/config/cloudinary.js

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🆕 Función auxiliar para subir archivos tipo PDF como recurso 'raw'
const subirPDFaCloudinary = async (filePath, publicId = null) => {
  try {
    const options = {
      resource_type: 'raw', // ⚠️ Muy importante para archivos no imagen (como PDF)
      folder: 'cotizaciones-tikbal',
    };

    if (publicId) {
      options.public_id = publicId;
      options.overwrite = true;
    }

    const result = await cloudinary.uploader.upload(filePath, options);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Error al subir a Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  subirPDFaCloudinary,
};