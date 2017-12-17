import * as _ from './utils';
import * as transform from './transform/list';

export const buildPage = () => {
  //
};

export const buildMulPage = () => {
  //
};

/** 通用函数 */
const genWebpackJs = (options) => {
  const {
    basePath = 'common/base/BaseComponent',
    eventSet,
    varMap
  } = options;
  // 基类名称
  const tmp = basePath.split('/');
  const name = tmp[tmp.length - 1];

  //事件函数
  let eventStr = '';
  eventSet.forEach(el => eventStr += `${el}(event) {
      console.log(event);
  },`);

  let dataStr = '';
  varMap.forEach((value, key) => dataStr += `${key}: ${value},\n`);

  // 先硬编码，之后再改
  return `import ${name} from '${basePath}';

  import template from './index.html';
  import * as API from './api';

  export default ${name}.extend({
    template,
    config(data) {
      this.defaults({
        ${dataStr}
      });
      this.supr(data);
    },

    //UI 事件
    ${eventStr}
  });
  `;
};

// 生成列表页
export const buildList = (listConfig, options) => {
  const {
    root = '0',
    // 页面标题，显示在card上
    pageTitle = '',
    // js代码生成相关配置
    jsConfig = {}
  } = options;

  const eventSet = new Set();
  // 默认加入的变量
  const varMap = new Map();
  varMap.set('url', `'${listConfig.url}'`);
  const vTree = transform.nejList(pageTitle, listConfig);

  const html = _.genHTML(vTree.tree, root, { eventSet, varMap });

  // 移除基类事件
  eventSet.forEach((el) => {
    vTree.excludeEvent.has(el) && eventSet.delete(el);
  });
  // 移除基类变量以及条件变量
  const conditionReg = /^condition\..+/;
  varMap.forEach((value, key) => {
    if (vTree.excludeVar.has(key) || conditionReg.test(value)) {
      varMap.delete(key);
    }
  });

  let js = genWebpackJs({
    basePath: jsConfig.ListPath,
    eventSet,
    varMap
  });
  return { [vTree.moduleName]: { html, js } };
};
