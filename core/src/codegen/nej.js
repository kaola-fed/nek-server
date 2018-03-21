import * as util from './utils';

const genNEJJS = (options) => {
  const {
    utilPath = 'pro/base/util',
    basePath = 'pro/widget/BaseComponent',
    modules = [],
    eventSet = new Set(),
    varMap = new Map(),
    moduleName = '',
    fileName = 'index',
    outMixin = false,
    url = '',
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
    '${utilPath}',
    '${basePath}',
    'text!./${fileName}.html',
    ${mixinStr}${moduleStr}
], function(_, ${baseName}, tpl ${isNeedMixin ? ', ListActionMixin' : ''}) {
    return ${baseName}.extend({
        name: '${moduleName}',
        template: tpl,${url ? `\nurl: '${url}',` : ''}
        config: function(data) {
            _.extend(data, {
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
  options.fileName = 'page';
  return util.buildList(listConfig, genNEJJS, options);
};
