const PdfPrinter = require('pdfmake');
const path = require('path');
const { subirBufferPDFaCloudinary } = require('../config/cloudinary');
const stream = require('stream');

// Cargar logo como base64
const fs = require('fs');
const logoPath = path.join(__dirname, '../assets/FONDO.jpg');
const logoBase64 = fs.existsSync(logoPath)
  ? fs.readFileSync(logoPath).toString('base64')
  : null;

// Fecha estilo "miércoles, 11 de junio de 2025"
const formatearFecha = () => {
  const fecha = new Date();
  return fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Tipografía
const fonts = {
  Poppins: {
    normal: path.join(__dirname, '../../fonts/Poppins-Regular.ttf'),
    bold: path.join(__dirname, '../../fonts/Poppins-Bold.ttf'),
    italics: path.join(__dirname, '../../fonts/Poppins-Italic.ttf'),
    bolditalics: path.join(__dirname, '../../fonts/Poppins-BoldItalic.ttf')
  }
};

const printer = new PdfPrinter(fonts);

// 🔁 Función principal
const generarPDFCotizacion = async (cotizacion, cliente, detalles) => {
  try {
    if (!cotizacion || !cliente || !detalles || detalles.length === 0) {
      throw new Error('Datos incompletos para generar la cotización PDF.');
    }

    const totalGeneral = detalles.reduce((acc, d) => acc + parseFloat(d.total), 0);

    const contenidoPDF = [
      { text: 'COTIZACIÓN', style: 'header' },
      { text: formatearFecha(), style: 'fecha' },
      {
        text:
          'Empresa: TIK´BAL\nCorreo: tikbalagricultora@gmail.com\nTeléfono: +502 3036-7561\nDirección: Ciudad de Guatemala\nNIT: nit de la empresa\n\n',
        style: 'subheader'
      },
      { text: `Cliente: ${cliente.nombre}\nNIT: ${cliente.nit}\n\n`, style: 'subheader' },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', '*', 'auto', 'auto'],
          body: [
            ['Tipo', 'Cantidad', 'Descripción', 'Precio Unitario (Q)', 'Total (Q)'],
            ...detalles.map(d => [
              d.tipo || 'bien',
              d.cantidad,
              d.descripcion,
              Number(d.precioUnitario).toFixed(2),
              Number(d.total).toFixed(2)
            ])
          ]
        },
        margin: [0, 0, 0, 10]
      },
      { text: `Total General: Q${totalGeneral.toFixed(2)}\n\n`, style: 'total' }
    ];

    if (cotizacion.observaciones) {
      contenidoPDF.push(
        { text: 'Observaciones:', bold: true, margin: [0, 0, 0, 2] },
        { text: cotizacion.observaciones, margin: [0, 0, 0, 10] }
      );
    }

    contenidoPDF.push({
      text: '\n______________________________\nFirma del Encargado de la empresa',
      style: 'footer'
    });

    const docDefinition = {
      background: logoBase64
        ? function (currentPage, pageSize) {
            return {
              image: 'logoVivero',
              width: 450,
              opacity: 0.1,
              absolutePosition: {
                x: (pageSize.width - 450) / 2,
                y: (pageSize.height - 450) / 2
              }
            };
          }
        : undefined,
      images: logoBase64
        ? {
            logoVivero: 'data:image/png;base64,' + logoBase64
          }
        : {},
      content: contenidoPDF,
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 5] },
        fecha: { fontSize: 10, alignment: 'center', italics: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 12, margin: [0, 0, 0, 10] },
        total: { fontSize: 14, bold: true, alignment: 'right' },
        nota: { fontSize: 11, italics: true, alignment: 'center', margin: [0, 10, 0, 0] },
        footer: { alignment: 'center', margin: [0, 20, 0, 0] }
      },
      defaultStyle: {
        font: 'Poppins'
      }
    };

    // 🧠 Convertir PDF a buffer directamente
    const pdfBuffer = await new Promise((resolve, reject) => {
      const doc = printer.createPdfKitDocument(docDefinition);
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.end();
    });

    // ☁️ Subir buffer a Cloudinary con extensión .pdf incluida en el publicId
    const pdfURL = await subirBufferPDFaCloudinary(pdfBuffer, `cotizacion-${cotizacion.id}.pdf`);
    return pdfURL;
  } catch (error) {
    console.error('❌ Error al generar el PDF:', error.message);
    throw error;
  }
};

module.exports = {
  generarPDFCotizacion
};