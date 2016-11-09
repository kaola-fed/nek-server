import { Component } from 'nek-ui';
import template from '!raw!./index.html';
import ModuleList from './modules/module.list';
import DropArea from './modules/drop.area';

require('rgui_css/regular-ui.default.css');
require('./sass/main.scss');

const App = Component.extend({
  name: 'app',
  template,
  config() {
    this.defaults({
      text: 'NEK',
    });
    this.supr();
  }
});

new App().$inject(document.body);