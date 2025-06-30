const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

// Solo login habilitado para producción
router.post('/login', authCtrl.login);

// ⚠️ Solo usar en desarrollo
router.post('/registrar', authCtrl.crearAdmin);

module.exports = router;