import nodemailer from 'nodemailer';

export default class GMailer {
  constructor (props) {
    const { login, pass } = props;
    this.transporter = nodemailer.createTransport('smtps://' + login + ':' + pass + '@smtp.gmail.com');
  }
  send (msgInfo) {
    const _this = this;
    const { to, subject, text, html } = msgInfo;
    const mailOptions = {
      from: 'notification-service 👥', // sender address
      to, //: 'asdasd@mail.ru' list of receivers
      subject,//: 'Hello ✔', // Subject line
      text,// 'Hello world 🐴', // plaintext body
      html,//: '<b>Hello world 🐴</b>' // html body
    };
    _this.transporter.sendMail(mailOptions, function(error, info){
      if(error){
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });
  }
};
