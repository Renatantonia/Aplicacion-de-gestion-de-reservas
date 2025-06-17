require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "canchasucenin@gmail.com",
    pass: "lzujxdlaztblwphe",
  },
});

// Función genérica para enviar correos
async function enviarCorreo(to, subject, text, html = null) {
  const mailOptions = {
    from: `"UCENIN Reservas" <${process.env.CORREO_EMISOR}>`,
    to,
    subject,
    text,
  };
  if (html) mailOptions.html = html;

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.messageId);
  } catch (error) {
    console.error("Error enviando correo:", error);
  }
}

// Función para correo de confirmación de reserva
async function enviarCorreoNuevaCancha(email, detalles) {
  const subject = "¡Nueva cancha disponible en UCENIN! Reserva ahora.";
  const text = `Tenemos una nueva cancha en Canchas UCENIN:\n${detalles}`;
  await enviarCorreo(email, subject, text);
}

// Función para correo de recordatorio
async function enviarCorreoRecordatorio(email, detalles, fecha) {
  const subject = "Recordatorio de reserva UCENIN";
  const text = `Recuerda que tienes una reserva para el día ${fecha}:\n${detalles}`;
  await enviarCorreo(email, subject, text);
}

module.exports = {
  enviarCorreoNuevaCancha,
  enviarCorreoRecordatorio,
  enviarCorreo, // si quieres usar la función genérica también
};
