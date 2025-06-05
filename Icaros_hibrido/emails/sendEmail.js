const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'icarosoficial01@gmail.com',
    pass: 'jzyw jdmy ulmf sqlf'
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: 'icarosoficial01@gmail.com',
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.response);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
};

module.exports = sendEmail;
