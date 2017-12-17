import * as _ from './utils';
import * as transform from './transform/list';

/** 通用函数 */

const genNEJJS = (options) => {
  const {
    basePath = 'pro/widget/BaseComponent',
    modules = '',
    eventSet,
    varMap
  } = options;

  // 基类名称
  const tmp = basePath.split('/');
  const name = tmp[tmp.length - 1];

  // 事件函数
  let eventStr = '';
  eventSet.forEach(el => eventStr += `${el}: function(event) {
    console.log(event);
  },`);

  let dataStr = '';
  varMap.forEach((value, key) => dataStr += `${key}: ${value},\n`);

  // 先硬编码，之后再改
  return `NEJ.define([
    '${basePath}',
    'text!./page.html',${modules}
], function(${name}, tpl) {
    return ${name}.extend({
        template: tpl,
        config: function(data) {
            this.defaults({
            ${dataStr}});
            this.supr(data);
        },

        // UI事件
        ${eventStr}
    });
});`;
};

/** NEJ 页面 */
// 只生成JS和HTML，ftl以及entry等项目相关的放到具体业务中生成

// 单文件生成
export const buildPage = () => {
  //
};

function genList(vTree, config) {
  const { root, url, ListPath } = config;

  const eventSet = new Set();
  // 默认加入的变量
  const varMap = new Map();
  varMap.set('url', `'${url}'`);

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

  let js = genNEJJS({
    basePath: ListPath,
    eventSet,
    varMap
  });

  return { js, html };
}

// 生成列表页
export const buildList = (listConfig, options) => {
  const {
    root = '0',
    // 页面标题，显示在card上
    pageTitle = '',
    // js代码生成相关配置
    jsConfig = {}
  } = options;

  const vTree = transform.nejList(pageTitle, listConfig);

  return {
    [vTree.moduleName]: genList(vTree, {
      root,
      url: listConfig.url,
      ListPath: jsConfig.ListPath
    })
  };
};

// 多文件列表
export const buildMulList = (listConfig, options) => {
  const {
    root = '0',
    // 页面标题，显示在card上
    pageTitle = '',
    // js代码生成相关配置
    jsConfig = {}
  } = options;

  const vTrees = transform.nejMulList(pageTitle, listConfig);

  const result = {};

  for (let i in vTrees) {
    if (vTrees.hasOwnProperty(i)) {
      const vTree = vTrees[i];
      result[vTree.moduleName] = genList(vTree, {
        root,
        url: listConfig.url,
        ListPath: jsConfig.ListPath
      });
    }
  }

  return result;
};
