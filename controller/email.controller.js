import nodemailer from 'nodemailer'  //install the nodemailer
function sendMail(email,verifylink) {
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mohitpatell9399@gmail.com',
    pass: 'qqrm fmjq ywok zxpz'
  }
});

let mailOptions = {
  from: 'Mern App',
  to: email,
  subject: 'verify your account',
  text: 'That was easy!',
  html:`
  <h1>Email Verification</h1>
  <p>click below link to verify your account
  <a href="${verifylink}">verify email</a>
  `

};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 
}

export default sendMail;