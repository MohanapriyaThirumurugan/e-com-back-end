import nodemailer from 'nodemailer'


const transport= nodemailer.createTransport({
  service:"gmail",
  // host:process.env.smtp_host,
  // port:process.env.smtp_port,
  

  auth:{
      user:process.env.smtp_from_email,
      pass:process.env.smtp_pass
  },
  
})
// console.log(process.env.smtp_from_email);
// console.log(process.env.smtp_pass);

const sendEmail = (options) => {
   console.log(process.env.smtp_from_email);
 console.log(process.env.smtp_pass);
  return new Promise((resolve, reject) => {
    transport.sendMail(options, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("email sent");
        resolve('Email sent');
      }
    });
  });
};

export default sendEmail