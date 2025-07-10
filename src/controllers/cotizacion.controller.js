const { Cotizacion, DetalleCotizacion, Cliente } = require('../models');
const { Op } = require('sequelize');
const { generarPDFCotizacion } = require('../services/pdfService');
const axios = require('axios');

const crearCotizacion = async (req, res) => {
  const { clienteId, productos, total, observaciones } = req.body;

  try {
    const cotizacion = await Cotizacion.create({ clienteId, total, observaciones });

    const detalles = productos.map(p => ({
      cotizacionId: cotizacion.id,
      descripcion: p.descripcion,
      cantidad: p.cantidad,
      precioUnitario: p.precioUnitario,
      total: p.total,
      tipo: p.tipo || 'bien'
    }));

    await DetalleCotizacion.bulkCreate(detalles);

    res.status(201).json({ cotizacionId: cotizacion.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear cotización' });
  }
};

const obtenerCotizaciones = async (req, res) => {
  try {
    const { clienteNombre, fechaDesde, fechaHasta, estado } = req.query;

    const where = {};
    const include = [
      {
        model: Cliente,
        where: clienteNombre
          ? { nombre: { [Op.iLike]: `%${clienteNombre}%` } }
          : undefined
      },
      { model: DetalleCotizacion }
    ];

    if (estado) where.estado = estado;
    if (fechaDesde && fechaHasta) {
      where.fecha = {
        [Op.between]: [new Date(fechaDesde), new Date(fechaHasta)]
      };
    }

    const cotizaciones = await Cotizacion.findAll({
      where,
      include,
      order: [['createdAt', 'DESC']]
    });

    res.json(cotizaciones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
};

const actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await Cotizacion.update({ estado }, { where: { id } });
    res.json({ mensaje: 'Estado actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar estado de la cotización' });
  }
};

const descargarPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const cotizacion = await Cotizacion.findByPk(id);
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    const cliente = await Cliente.findByPk(cotizacion.clienteId);
    const detalles = await DetalleCotizacion.findAll({ where: { cotizacionId: id } });

    if (!cliente || detalles.length === 0) {
      return res.status(400).json({ error: 'No se puede generar el PDF: datos incompletos' });
    }

    const pdfURL = await generarPDFCotizacion(cotizacion, cliente, detalles);
    res.json({ url: pdfURL });
  } catch (err) {
    console.error('❌ Error al generar PDF:', err.message);
    res.status(500).json({ error: 'Error inesperado al generar PDF' });
  }
};

// ✅ NUEVO: Forzar descarga directa desde Cloudinary
const descargarPDFDirecto = async (req, res) => {
  try {
    const { id } = req.params;

    const cotizacion = await Cotizacion.findByPk(id);
    if (!cotizacion) return res.status(404).json({ error: 'Cotización no encontrada' });

    const cliente = await Cliente.findByPk(cotizacion.clienteId);
    const detalles = await DetalleCotizacion.findAll({ where: { cotizacionId: id } });
    if (!cliente || detalles.length === 0) return res.status(400).json({ error: 'Datos incompletos' });

    const pdfURL = await generarPDFCotizacion(cotizacion, cliente, detalles);

    // Descargar el PDF como buffer
    const response = await axios.get(pdfURL, { responseType: 'arraybuffer' });

    const nombreCliente = cliente.nombre.trim().replace(/\s+/g, '_');
    const nombreArchivo = `Cotizacion_${nombreCliente}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${nombreArchivo}"`,
      'Content-Length': response.data.length
    });

    res.send(response.data);
  } catch (err) {
    console.error('❌ Error al forzar descarga PDF:', err.message);
    res.status(500).json({ error: 'Error al descargar PDF directamente' });
  }
};

const editarCotizacion = async (req, res) => {
  const { id } = req.params;
  const { clienteId, productos, total, observaciones } = req.body;

  try {
    const cotizacion = await Cotizacion.findByPk(id);
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    await Cotizacion.update({ clienteId, total, observaciones }, { where: { id } });

    await DetalleCotizacion.destroy({ where: { cotizacionId: id } });

    const nuevosDetalles = productos.map(p => ({
      cotizacionId: id,
      descripcion: p.descripcion,
      cantidad: p.cantidad,
      precioUnitario: p.precioUnitario,
      total: p.total,
      tipo: p.tipo || 'bien'
    }));

    await DetalleCotizacion.bulkCreate(nuevosDetalles);

    res.json({ mensaje: 'Cotización actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al editar la cotización' });
  }
};

const eliminarCotizacion = async (req, res) => {
  try {
    const { id } = req.params;

    const cotizacion = await Cotizacion.findByPk(id);
    if (!cotizacion) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    await DetalleCotizacion.destroy({ where: { cotizacionId: id } });
    await Cotizacion.destroy({ where: { id } });

    res.json({ mensaje: 'Cotización eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar la cotización' });
  }
};

module.exports = {
  crearCotizacion,
  obtenerCotizaciones,
  actualizarEstado,
  descargarPDF,
  descargarPDFDirecto, // ✅ nuevo
  editarCotizacion,
  eliminarCotizacion
};