import * as util from './utils';

const genNEJJS = (options) => {
  const {
    basePath = 'pro/widget/BaseComponent',
    modules = [],
    eventSet = new Set(),
    varMap = new Map(),
    moduleName = '',
    outMixin = false
  } = options;

  // 基类名称
  const tmp = basePath.split('/');
  const baseName = tmp[tmp.length - 1];

  // 事件函数
  let eventStr = '';
  eventSet.forEach(el => eventStr += `${el}: function(event) {
    console.log(event);
  },`);

  let dataStr = '';
  varMap.forEach((value, key) => dataStr += `${key}: ${value},\n`);
  const moduleStr = modules.length ? `\n    ${modules.map(el => `'./${el}/index.js',`.join('\n'))}` : '';

  const js = `NEJ.define([
    'pro/base/util',
    '${basePath}',
    'text!./${moduleName || 'index'}.html',
    '${outMixin ? '../../' : './mixins/'}${moduleName}.action.js',${moduleStr}
], function(_, ${baseName}, tpl, ListActionMixin) {
    return ${baseName}.extend({
        name: '${moduleName}',
        template: _.compressHtml(tpl),
        config: function(data) {
            this.defaults({
            ${dataStr}});
            this.supr(data);
        },
    }).use(ListActionMixin);
});`;

  const mixin = `define([], function() {
      return function(Component) {
          Component.implement({
              ${eventStr}
          });
      }
  })`;

  return { js, mixin };
};

export const buildList = (listConfig, options) => {
  return util.buildList(listConfig, genNEJJS, options);
};
