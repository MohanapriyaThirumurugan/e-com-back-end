import nodemailer from 'nodemailer'


const transport= nodemailer.createTransport({
  service:"gmail",
  // host:process.env.smtp_host,
  // port:process.env.smtp_port,
  auth:{
      user:process.env.smtp_from_email,
      pass:process.env.smtp_pass
  }
})
const sendEmail = (options) => {
  return new Promise((resolve, reject) => {
    transport.sendMail(options, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve('Email sent');
      }
    });
  });
};

export default sendEmail