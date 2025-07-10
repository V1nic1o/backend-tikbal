// src/config/cloudinary.js

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// ✅ Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔽 Subida desde archivo físico (.pdf) como recurso raw
const subirPDFaCloudinary = async (filePath, publicId = null) => {
  try {
    const options = {
      resource_type: 'raw',
      folder: 'cotizaciones-tikbal',
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const result = await cloudinary.uploader.upload(filePath, options);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Error al subir archivo local a Cloudinary:', error);
    throw error;
  }
};

// 🔁 Subida desde memoria (Buffer), ideal para entornos serverless o sin disco
const subirBufferPDFaCloudinary = (buffer, publicId = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      resource_type: 'raw',
      folder: 'cotizaciones-tikbal',
      public_id: publicId || undefined,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error('❌ Error al subir buffer a Cloudinary:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = {
  cloudinary,
  subirPDFaCloudinary,
  subirBufferPDFaCloudinary,
};