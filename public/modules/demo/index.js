const RGUI = require('nek-ui');
const tpl = require('!raw!./index.html');
const Title = require('./components/title');

const Demo = RGUI.Component.extend({
  name: 'demo',
  template: tpl,
});

module.exports = Demo;
