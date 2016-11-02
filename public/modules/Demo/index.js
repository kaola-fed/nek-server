const RGUI = require('nek-ui');
const tpl = require('!raw!./index.html');
const Title = require('./components/Title');

const Demo = RGUI.Component.extend({
  name: 'Demo',
  template: tpl,
})

module.exports = Demo;
