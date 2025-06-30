const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Servicio = sequelize.define('Servicio', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imagenes: {
      type: DataTypes.ARRAY(DataTypes.STRING), // rutas de Cloudinary
      defaultValue: [],
    },
  });

  return Servicio;
};