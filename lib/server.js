import api from './api';
import { Server } from 'http';
import l from './logger';
import options from './../options';
import GMailer from './gmailer';
import WSServer from './ws-server';

function start (httpServer) {
  l.log('creating ws server..');
  const notifyService = new GMailer({ login: options.SENDER_GMAIL_LOGIN, pass: options.SENDER_GMAIL_PASS });
  const wss = new WSServer({
    server: httpServer,
    regHosts: ['127.0.0.1'],
    onMessage: (message) => {
      l.log('incoming message.');
      // TODO вынести в отдельный модуль
      options.NOTIFY_MAIL_LIST.forEach((mail) => {
        notifyService.send({ to: mail, subject: 'hello', text: 'some text', html: '<h3>' + message + '</h3>' });
      });
    }
  });
}

const httpServer = Server(api());
httpServer.listen(options.PORT);
l.log('Server listenning on port: ' + options.PORT);
start(httpServer);
