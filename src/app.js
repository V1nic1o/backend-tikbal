const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ CORS configurado para permitir localhost y Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'https://panel-admin-tikbal.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  exposedHeaders: ['Content-Disposition'] // ✅ Necesario para descargar PDF
}));

// ✅ Habilita el acceso a archivos en /temp (donde se guarda el PDF)
app.use('/temp', express.static(path.join(__dirname, '../temp')));

// Middleware de logs
app.use(morgan('dev'));

// ⚠️ Solo procesar JSON y URL encoded en rutas que no sean multipart
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas existentes
const authRoutes = require('./routes/auth.routes');
const servicioRoutes = require('./routes/servicio.routes');
const proyectoRoutes = require('./routes/proyecto.routes');
const mensajeRoutes = require('./routes/mensaje.routes');
const uploadRoutes = require('./routes/upload.routes');

// 🆕 Nuevas rutas integradas
const clienteRoutes = require('./routes/cliente.routes');
const cotizacionRoutes = require('./routes/cotizacion.routes');

// Endpoints existentes
app.use('/api/auth', authRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/upload', uploadRoutes);

// 🆕 Endpoints integrados
app.use('/api/clientes', clienteRoutes);
app.use('/api/cotizaciones', cotizacionRoutes);

// Ruta base
app.get('/', (req, res) => res.send('API Tikb’al funcionando ✅'));

module.exports = app;