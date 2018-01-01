import * as util from './utils';

/** 通用函数 */

const genWebpackJs = (options) => {
  const {
    basePath = 'common/base/BaseComponent',
    eventSet = new Set(),
    varMap = new Map(),
    modules = [],
    moduleName = '',
    fileName = 'index',
    outMixin = false,
    isNeedMixin = true
  } = options;
  // 基类名称
  const tmp = basePath.split('/');
  const name = tmp[tmp.length - 1];

  //事件函数
  let eventStr = '';
  eventSet.forEach((el) => {
    if (el === 'onTabChange') {
      eventStr += `${el}(event) {
        this.data.tab = event.key;
      },`;
    } else {
      eventStr += `${el}(event) {
        console.log(event);
      },`;
    }
  });

  let dataStr = '';
  varMap.forEach((value, key) => dataStr += `${key}: ${value},\n`);
  // 模块name
  let listModuleName = '';
  if (moduleName) {
    listModuleName = `name: '${moduleName}',`;
  }

  // 引入模块
  let modulesStr = '';
  // 声明模块
  let componentsStr = '';
  modules.forEach((el) => {
    modulesStr += `import ${el} from './modules/${el}/index.js';\n`;
    componentsStr += `.component('${el}', ${el})\n`;
  });

  let mixinStr = isNeedMixin ?
      `import ListActionMixin from '${outMixin ? '../../' : './'}mixins/list.action.js';`
    : '';

  const js = `import ${name} from '${basePath}';

  import template from './${fileName}.html';
  ${mixinStr}
  ${modulesStr}

  export default ${name}.extend({
      ${listModuleName}
      template,
      config(data) {
          this.defaults({
              ${dataStr}
          });
          this.supr(data);
      },
      ${isNeedMixin ? '' : `${eventStr}`}
  })${isNeedMixin ? '.use(ListActionMixin)' : ''}${componentsStr};
  `;

  const mixin = `export default (Component) => {
      Component.implement({
          ${eventStr}
      });
  }`;

  return { js, mixin };
};

export const buildList = (listConfig, options) => {
  return util.buildList(listConfig, genWebpackJs, options);
};
