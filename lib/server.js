import api from './api';
import { Server } from 'http';
import l from './logger';
import options from './../options';
import GMailer from './gmailer';
import WSServer from './ws-server';
import Slacker from './slacker';

function start (httpServer) {
  const slacker = new Slacker({
    webhookUri: options.SLACK_WEBHOOK_URI
  });
  l.log('creating WebSocketServer..');
  const gmailer = new GMailer({ login: options.SENDER_GMAIL_LOGIN, pass: options.SENDER_GMAIL_PASS });
  const wss = new WSServer({
    server: httpServer,
    regHosts: options.REG_SOCKET_HOSTS,
    onMessage: (msgStr) => {
      const message = JSON.parse(msgStr);
      l.log('incoming message.');
      // TODO вынести в отдельный модуль
      let gmail = false;
      let slack = false;
      if (message.hasOwnProperty('types')) {
        message.types.forEach((type) => {
          switch (type) {
            case 'gmail':
              gmail = true;
              break;
            case 'slack':
              slack = true;
              break;
            default:
              l.log('Message type ' + type + ' not supported.');
              break;
          }
        });
      }
      console.log(gmail, slack, options.NOTIFY_MAIL_LIST);
      options.NOTIFY_MAIL_LIST.forEach((mail) => {
        console.log('sending to ', mail, msgStr);
        if (gmail) {
          gmailer.send({ to: mail, subject: 'hello', text: msgStr, html: '<div>' + msgStr + '</div>' });
        }
        if (slack) {
          console.log('slacker send msg');
          //slacker.send('hello');
        }
      });
    }
  });
}

const httpServer = Server(api());
httpServer.listen(options.PORT);
l.log('Server listenning on port: ' + options.PORT);
start(httpServer);

