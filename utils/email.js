const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// For create email obj to send actual emails.
module.exports = class Email {
  constructor(eventBody) {
    this.eventBody = eventBody;
    this.to = process.env.EMAIL_TO;
    this.from = `ONDC <${process.env.EMAIL_FROM}>`;
  }

 // Create different transports for different environments
 newTransport() {

    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
        transport
        .verify()
        .then(() => console.log("Connected to email server 📧 ..."))
        .catch(() => console.log("Unable to connect to email server. Make sure you have configured the SMTP options."));
    return transport;
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      data: this.eventBody,
      subject
    });
    
    let mailList = this.to.split(',');

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: mailList,
      subject,
      html,
      text: htmlToText.fromString(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendRegistrationDetails() {
    await this.send('sendRegistrationDetails', 'New User Added!');
  }
};