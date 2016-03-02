import Slack from 'slack-node';

export default class Slacker {
  constructor (props) {
    const { webhookUri } = props;
    const _this = this;
    _this.webhookUri = webhookUri;
    _this.init();
  }

  init () {
    const _this = this;
    _this.slack = new Slack();
    _this.slack.setWebhook(_this.webhookUri);
    console.log('slacker: ready.');
  }

  send (msg) {
    const _this = this;
    _this.slack.webhook({
      channel: "#pinger",
      username: "RO",
      icon_emoji: ":robot_face:",
      text: msg
    }, function(err, response) {
      console.log(err, response);
    });
  }
};
