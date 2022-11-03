const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// For create email obj to send actual emails.
module.exports = class Email {
  constructor(eventBody) {
    this.eventBody = eventBody;
    this.to = eventBody.email;
    this.from = `kitsune <${process.env.EMAIL_FROM}>`;
  }

  // Create different transports for different environments
  newTransport() {

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
      data: this.eventBody,
      subject
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
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