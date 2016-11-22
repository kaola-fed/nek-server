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
    this.$state.on('end', () => {
      this.$update('curName', this.$state.current.currentName);
      this.$update('projectId', this.$state.param.projectId);
      if (!this.$state.is('app.home') && !this.$state.param.projectId) {
        setTimeout(() => {
          this.$state.go('app.home');
        }, 0);
      }
    });
    this.supr();
  },

  computed: {
    hideEntries(data) {
      return ['setting', 'detail'].indexOf(data.curName) < 0;
    },
  },
});

export default App;
