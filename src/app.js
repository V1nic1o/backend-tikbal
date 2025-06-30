const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(morgan('dev'));

// ⚠️ Solo procesar JSON y URL encoded en rutas que no sean multipart
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
const authRoutes = require('./routes/auth.routes');
const servicioRoutes = require('./routes/servicio.routes');
const proyectoRoutes = require('./routes/proyecto.routes');
const mensajeRoutes = require('./routes/mensaje.routes');
const uploadRoutes = require('./routes/upload.routes');

// Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/upload', uploadRoutes);

// Ruta base
app.get('/', (req, res) => res.send('API Tikb’al funcionando ✅'));

module.exports = app;