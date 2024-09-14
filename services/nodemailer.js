// Import the Nodemailer library
const nodemailer = require('nodemailer');

// Create a transporter object
const sendMail = async (email,message)=>{
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: true, // use SSL
            auth: {
              user: 'satyam8871691032@gmail.com',
              pass: 'pkie exkp irhh hbhz',
            }
          });
          
          // Configure the mailoptions object
          const mailOptions = {
            from: 'satyam8871691032@gmail.com',
            to: email,
            subject: 'Confirmation Mail !',
            text:'Hello',
            html:message
          };
          
          // Send the email
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = sendMail;
