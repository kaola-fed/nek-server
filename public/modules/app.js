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
    });
    this.supr();
  },
  enter(options) {
    this.$update('curPath', options.current.name);
  },
});

export default App;
