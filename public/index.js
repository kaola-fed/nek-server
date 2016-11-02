const RGUI = require('nek-ui');
const tpl = require('!raw!./index.html');
const Button = require('./common/Button');
const Demo = require('./modules/Demo');

require('rgui_css/regular-ui.default.css');
require('./sass/main.scss');

const App = RGUI.Component.extend({
  name: 'App',
  template: tpl,
  config: function () {
    this.defaults({
      text: 'NEK',
    });
    this.supr();
  }
});

new App().$inject(document.body);