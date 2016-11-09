const RGUI = require('nek-ui');
const tpl = require('!raw!./index.html');
const ModuleList = require('./modules/module.list');
const DropArea = require('./modules/drop.area');

require('rgui_css/regular-ui.default.css');
require('./sass/main.scss');

const App = RGUI.Component.extend({
  name: 'app',
  template: tpl,
  config: function () {
    this.defaults({
      text: 'NEK',
    });
    this.supr();
  }
});

new App().$inject(document.body);