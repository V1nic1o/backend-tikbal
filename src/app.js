const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ CORS manual como refuerzo (garantiza encabezados en todas las respuestas)
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'https://panel-admin-tikbal.vercel.app'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  }
  next();
});

// ✅ Middleware cors normal (para peticiones CORS preflight)
app.use(cors({
  origin: function (origin, callback) {
    const allowed = [
      'http://localhost:5173',
      'https://panel-admin-tikbal.vercel.app'
    ];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

// ✅ Acceso a la carpeta /temp para PDF
app.use('/temp', express.static(path.join(__dirname, '../temp')));

// Middleware de logs
app.use(morgan('dev'));

// JSON y urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./routes/auth.routes');
const servicioRoutes = require('./routes/servicio.routes');
const proyectoRoutes = require('./routes/proyecto.routes');
const mensajeRoutes = require('./routes/mensaje.routes');
const uploadRoutes = require('./routes/upload.routes');
const clienteRoutes = require('./routes/cliente.routes');
const cotizacionRoutes = require('./routes/cotizacion.routes');

app.use('/api/auth', authRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/cotizaciones', cotizacionRoutes);

// Ruta base
app.get('/', (req, res) => res.send('API Tikb’al funcionando ✅'));

module.exports = app;