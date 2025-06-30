const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const ctrl = require('../controllers/upload.controller');

router.post('/', upload.array('imagenes', 10), ctrl.subirImagen);

module.exports = router;