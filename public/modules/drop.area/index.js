const RGUI = require('nek-ui');
const tpl = require('!raw!./index.html');

require('rgui_css/regular-ui.default.css');
require('../../sass/dropArea.scss');

const DropArea = RGUI.Component.extend({
    name: 'dropArea',
    template: tpl,
    config: function() {
        this.defaults({
            col: 24,
            row: 24
        });
        this.supr();
    }
});

module.exports = DropArea;
