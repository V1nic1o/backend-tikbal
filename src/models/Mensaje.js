const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Mensaje = sequelize.define('Mensaje', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  return Mensaje;
};