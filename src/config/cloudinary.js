// src/config/cloudinary.js

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🧠 Subida desde un archivo físico (.pdf) como recurso raw
const subirPDFaCloudinary = async (filePath, publicId = null) => {
  try {
    const options = {
      resource_type: 'raw',
      folder: 'cotizaciones-tikbal',
    };

    if (publicId) {
      options.public_id = publicId;
      options.overwrite = true;
    }

    const result = await cloudinary.uploader.upload(filePath, options);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Error al subir archivo local a Cloudinary:', error);
    throw error;
  }
};

// 🆕 Subida desde memoria (Buffer) → para evitar usar fs y temp
const subirBufferPDFaCloudinary = (buffer, publicId = null) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'cotizaciones-tikbal',
        public_id: publicId || undefined,
        overwrite: true
      },
      (error, result) => {
        if (error) {
          console.error('❌ Error al subir buffer a Cloudinary:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = {
  cloudinary,
  subirPDFaCloudinary,
  subirBufferPDFaCloudinary,
};