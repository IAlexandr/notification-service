const version = require('./package.json').version;
import credentials from './credentials';
const optionsSpec = {
  SENDER_GMAIL_LOGIN: {
    required: true,
    default: credentials.SENDER_GMAIL_LOGIN,  // без @gmail.com
    env: 'NS_SENDER_GMAIL_LOGIN'
  },
  SENDER_GMAIL_PASS: {
    required: true,
    default: credentials.SENDER_GMAIL_PASS,
    env: 'NS_SENDER_GMAIL_PASS'
  },
  SLACK_WEBHOOK_URI: {
    required: true,
    default: credentials.SLACK_WEBHOOK_URI,
    env: 'NS_SLACK_WEBHOOK_URI'
  },
  PORT: {
    required: true,
    default: '4445',
    env: 'NS_PORT'
  },
  REG_SOCKET_HOSTS: {
    require: true,
    default: "110.10.0.227",
    env: 'NS_REG_SOCKET_HOSTS',
    preprocess: function (src) {
      const sr = src ? src.split(',').map(function (s) {
        return s.trim();
      }) : [];
      return sr;
    }
  },
  NOTIFY_MAIL_LIST: {
    require: true,
    default: credentials.NOTIFY_MAIL_LIST,
    env: 'NS_NOTIFY_MAIL_LIST',
    preprocess: function (src) {
      const sr = src ? src.split(',').map(function (s) {
        return s.trim();
      }) : [];
      return sr;
    }
  },
};

let options = {
  version
};

export default {...options, ...Object.keys(optionsSpec).map((key) => {
  if (!optionsSpec[key].preprocess) {
    optionsSpec[key].preprocess = function preprocess (str) {
      return str;
    };
  }
  const opt = { name: key };
  if (process.env[optionsSpec[key].env]) {
    opt.value = optionsSpec[key].preprocess(process.env[optionsSpec[key].env]);
  } else if (optionsSpec[key].default) {
    opt.value = optionsSpec[key].preprocess(optionsSpec[key].default);
  } else if (optionsSpec[key].required) {
    throw new Error('!!! REQUIRED OPTION NOT SET: ' + key);
  }
  return opt;
}).reduce((prev, cur) => {
  prev[cur.name] = cur.value;
  return prev;
}, {})};
