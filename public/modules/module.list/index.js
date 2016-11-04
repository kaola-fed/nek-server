const RGUI = require('nek-ui');
const tpl = require('!raw!./index.html');
import {  Draggable, Droppable, Movable } from 'rgui-ui-drag'

require('rgui_css/regular-ui.default.css');
require('../../sass/moduleList.scss');

const ModuleList = RGUI.Component.extend({
    name: 'moduleList',
    template: tpl,
    config: function() {
        this.defaults({
            list: [
                {
                    category: {
                        name: '基础组件',
                        modules: [{
                            name: 'form.input',
                            moduleId: 1,
                            width: 5,
                            height: 1
                        }, {
                            name: 'form.number',
                            moduleId: 1,
                            width: 4,
                            height: 1
                        },
                        {
                            name: 'form.number',
                            moduleId: 1,
                            width: 4,
                            height: 1
                        }]
                    }
                },
                {
                    category: {
                        name: '业务组件',
                        modules: [{
                            name: 'form.input',
                            moduleId: 1,
                            width: 5,
                            height: 1
                        }, {
                            name: 'form.input',
                            moduleId: 1,
                            width: 5,
                            height: 1
                        }, {
                            name: 'form.number',
                            moduleId: 1,
                            width: 4,
                            height: 1
                        }]
                    }
                }
            ]
        });
        this.supr();
    }
});

module.exports = ModuleList;
