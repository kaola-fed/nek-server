import { Component } from 'nek-ui';
import template from '!raw!./app.html';

require('rgui_css/regular-ui.default.css');
require('../sass/main.scss');

const App = Component.extend({
  name: 'app',
  template,
  config() {
    this.defaults({
      text: 'NEK',
      curPath: this.$state.history.curPath,
    });
    this.supr();
  },
});

export default App;
