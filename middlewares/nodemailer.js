const nodemailer = require("nodemailer");


const emailSender =  async(options)=>{
    // Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  host: process.env.EMAIL_HOST,
  port: 587, // use 465 for SSL, 587 for TLS
  tls: {
    rejectUnauthorized: false,
  },
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});


// Wrap in an async IIFE so we can use await.
(async () => {
  const info = await transporter.sendMail({
    from: `"Brekki kitchen" <${process.env.APP_USER}>`,
    to: options.email,
    subject: options.subject,
    //text: "Hello world?", // plain‑text body
    html: options.html, // HTML body
  });

  console.log("Message sent:", info.messageId);
})();
}
module.exports = emailSender