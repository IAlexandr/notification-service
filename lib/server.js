import GMailer from './gmailer';
import WSServer from './ws-server';

const notifyService = new GMailer({ login: 'ai.notification.service', pass: '***' });
const wss = new WSServer({
  port: 8888,
  regHosts: ['127.0.0.1'],
  onMessage: (message) => {
    console.log('incoming message.');
    notifyService.send({ to: '***', subject: 'hello', text: 'some text', html: '<h3>' + message + '</h3>' });
  }
});
console.log();
