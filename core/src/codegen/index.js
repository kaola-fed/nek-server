import * as _ from './utils';
import * as transform from './transform';

/** 通用函数 */

const genHTML = (tree, nodeId, { eventSet, varSet, level = 0 }) => {
  const vNode = tree[nodeId];

  const { tagName, attributes, events, children, text } = vNode;

  const intend = new Array(level * 4).fill(' ').join('');

  if (!tagName) {
    return `${intend}${text || ''}`;
  }

  // 记录事件名
  let eventStr = '';
  for (let i in events) {
    if (events.hasOwnProperty(i)) {
      eventSet.add(events[i]);
      eventStr += ` on-${i}={this.${events[i]}($event)}`;
    }
  }

  return `${intend}<${tagName}${_.getAttributesStr(attributes, false, varSet)}${eventStr}>` +
    `${children.length ? `\n${children.map(el => genHTML(tree, el, { eventSet, varSet, level: level + 1 })).join('\n')}\n${intend}` : ''}</${tagName}>`;
};

const genNEJJS = (options) => {
  const {
    basePath = 'pro/widget/BaseComponent',
    eventSet,
    varSet
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
  varSet.forEach(el => dataStr += `${el}: null,\n`);

  // 先硬编码，之后再改
  return `NEJ.define([
    '${basePath}',
    'text!./page.html',
], function(${name}, tpl){
    return ${name}.extend({
        template: tpl,
        config: function(data) {
            this.supr(data);
            this.default({
            ${dataStr}});
        },

        // UI事件
        ${eventStr}
    });
});`;
};

/** NEJ 页面 */

// 单文件生成
// 只生成JS和HTML，ftl以及entry等项目相关的放到具体业务中生成
export const buildNEJPage = () => {
  //
};

export const buildNEJList = (listConfig, options) => {
  const {
    root = '0',
    // 页面标题，显示在card上
    pageTitle = '',
    // js代码生成相关配置
    jsConfig = {}
  } = options;

  const eventSet = new Set();
  // 默认加入的变量
  const varSet = new Set([listConfig.url]);

  const vTree = transform.nejList(pageTitle, listConfig);

  const html = genHTML(vTree.tree, root, { eventSet, varSet });

  // 移除基类事件
  eventSet.forEach((el) => {
    vTree.excludeEvent.has(el) && eventSet.delete(el);
  });
  // 移除基类变量以及条件变量
  const conditionReg = /^condition\..+/;
  varSet.forEach((el) => {
    if (vTree.excludeVar.has(el) || conditionReg.test(el)) {
      varSet.delete(el);
    }
  });

  let js = genNEJJS({
    basePath: jsConfig.ListPath,
    eventSet,
    varSet
  });
  return { html, js };
};

// 多文件生成
export const buildNEJMulPage = () => {
  //
};

/** Webpack 多页 */

/** Webpack单页 */
