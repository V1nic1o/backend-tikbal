const app = require('./app');
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const { sequelize } = require('./models');
sequelize.sync({ alter: true }).then(() => {
  console.log('📦 Base de datos actualizada');
});