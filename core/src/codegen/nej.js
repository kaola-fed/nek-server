import * as util from './utils';

const genNEJJS = (options) => {
  const {
    basePath = 'pro/widget/BaseComponent',
    modules = [],
    eventSet = new Set(),
    varMap = new Map(),
    moduleName = '',
    fileName = 'index',
    outMixin = false,
    isNeedMixin = true
  } = options;

  // 基类名称
  const tmp = basePath.split('/');
  const baseName = tmp[tmp.length - 1];

  // 事件函数
  let eventStr = '';
  eventSet.forEach((el) => {
    if (el === 'onTabChange') {
      eventStr += `${el}: function(event) {
        this.data.tab = event.key;
      },`;
    } else {
      eventStr += `${el}: function(event) {
        console.log(event);
      },`;
    }
  });

  let dataStr = '';
  varMap.forEach((value, key) => dataStr += `${key}: ${value},\n`);
  const moduleStr = modules.length ? `\n    ${modules.map(el => `'./${el}/index.js',`).join('\n')}` : '';

  const mixinStr = isNeedMixin ?
    `'${outMixin ? '../../' : './'}mixins/list.action.js',` : '';

  const js = `NEJ.define([
    'pro/base/util',
    '${basePath}',
    'text!./${fileName}.html',
    ${mixinStr}${moduleStr}
], function(_, ${baseName}, tpl ${isNeedMixin ? ', ListActionMixin' : ''}) {
    return ${baseName}.extend({
        name: '${moduleName}',
        template: _.compressHtml(tpl),
        config: function(data) {
            this.defaults({
            ${dataStr}});
            this.supr(data);
        },
        ${isNeedMixin ? '' : `${eventStr}`}
    })${isNeedMixin ? '.use(ListActionMixin)' : ''};
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
