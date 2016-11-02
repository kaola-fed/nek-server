const RGUI = require('nek-ui');
const tpl = require('!raw!./index.html');

const Button = RGUI.Component.extend({
  name: 'Button',
  template: tpl,
  config: function () {
    this.defaults({
      title: 'click me',
    });
    this.supr();
  }
});

module.exports = Button;
