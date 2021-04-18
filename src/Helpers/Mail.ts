import * as nodemailer from 'nodemailer';

var transporter : nodemailer.Transporter = nodemailer.createTransport({
  host: process.env.MAIL_SMTP_HOST,
  port: Number(process.env.MAIL_SMTP_PORT)|0,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

export function send(email : string, subject : string, htmlcontent : string, callback : Function) {
  var mailOptions : nodemailer.SendMailOptions = {
    from: process.env.MAIL_SENDER,
    to: email,
    subject: subject,
    html: htmlcontent
  };

  transporter.sendMail(mailOptions, function (err : Error, info : object) {
    transporter.close();
    if (err) {
      callback(err, info);
    } else {
      callback(null, info);
    }
  });
};

export async function verify(callback : any) {
  await transporter.verify(callback);
};
