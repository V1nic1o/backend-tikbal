module.exports = (sequelize, DataTypes) => {
  const Cotizacion = sequelize.define('Cotizacion', {
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: 'pendiente'
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'cotizaciones',
    timestamps: true
  });

  Cotizacion.associate = (models) => {
    Cotizacion.belongsTo(models.Cliente, { foreignKey: 'clienteId' });
    Cotizacion.hasMany(models.DetalleCotizacion, { foreignKey: 'cotizacionId', onDelete: 'CASCADE' });
  };

  return Cotizacion;
};