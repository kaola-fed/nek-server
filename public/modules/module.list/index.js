const RGUI = require('nek-ui');
const tpl = require('!raw!./index.html');
import {  Draggable, Droppable, Movable } from 'rgui-ui-drag'


const ModuleList = RGUI.Component.extend({
    name: 'moduleList',
    template: tpl,
    config: function() {
        this.defaults({
            tdWidth: 40,
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
                            moduleId: 2,
                            width: 4,
                            height: 2
                        },
                        {
                            name: 'form.number',
                            moduleId: 3,
                            width: 5,
                            height: 3
                        }]
                    }
                },
                {
                    category: {
                        name: '业务组件',
                        modules: [{
                            name: 'form.input',
                            moduleId: 4,
                            width: 24,
                            height: 5
                        }, {
                            name: 'form.input',
                            moduleId: 5,
                            width: 10,
                            height: 3
                        }, {
                            name: 'form.number',
                            moduleId: 6,
                            width: 12,
                            height: 6
                        }]
                    }
                }
            ]
        });
        this.supr();
    }
});

module.exports = ModuleList;
