const RGUI = require('nek-ui');
const tpl = require('!raw!./index.html');

const Title = RGUI.Component.extend({
  name: 'title',
  template: tpl,
});

module.exports = Title;
