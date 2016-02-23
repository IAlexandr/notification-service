import api from './api';
import { Server } from 'http';
import l from './logger';
import options from './../options';
import GMailer from './gmailer';
import WSServer from './ws-server';
import Slacker from './slacker';

function start (httpServer) {
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
      options.NOTIFY_MAIL_LIST.forEach((mail) => {
        console.log('sending to ', mail, message);
        if (gmail) {
          gmailer.send({ to: mail, subject: 'hello', text: 'some text', html: '<h3>' + message + '</h3>' });
        }
        if (slack) {
          slacker.send('hello');
        }
      });
    }
  });
}

const httpServer = Server(api());
httpServer.listen(options.PORT);
l.log('Server listenning on port: ' + options.PORT);
start(httpServer);
const slacker = new Slacker({
  webhookUri: 'jhkjhjkhkjhk'
});
//slacker.send('test message');
