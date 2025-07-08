module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nit: {
      type: DataTypes.STRING,
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'clientes',
    timestamps: true
  });

  Cliente.associate = (models) => {
    Cliente.hasMany(models.Cotizacion, { foreignKey: 'clienteId', onDelete: 'CASCADE' });
  };

  return Cliente;
};