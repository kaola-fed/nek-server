import * as _ from './utils';
import * as transform from './transform/list';

/** 通用函数 */

const genNEJJS = (options) => {
  const {
    basePath = 'pro/widget/BaseComponent',
    modules = '',
    eventSet,
    varMap,
    moduleName = ''
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

  // 先硬编码，之后再改
  return `NEJ.define([
    'pro/base/util',
    '${basePath}',
    'text!./page.html',${modules}
], function(_, ${baseName}, tpl) {
    return ${baseName}.extend({${moduleName ? `\nname: ${moduleName},\n` : ''}
        template: _.compressHtml(tpl),
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


function genList(vTree, config) {
  const {
    root = '0',
    url = '',
    ListPath = '',
    modules = '',
    moduleName = ''
  } = config;

  const eventSet = new Set();
  // 默认加入的变量
  const varMap = new Map();
  let mock = {
    code: 200,
    message: null,
    data: {
      list: [],
      pagination: {
        pageNo: 2,
        pageSize: 20,
        total: 5
      }
    }
  };
  // url存在，设置mock数据
  if (url) {
    varMap.set('url', `'${url}'`);
    mock.data.list = _.genMockData(vTree.cols);
    mock = JSON.stringify(mock);
  } else {
    mock = null;
  }
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
    varMap,
    modules,
    moduleName
  });

  return { js, html, url, mock };
}

// 生成列表页
export const buildList = (listConfig, options) => {
  const {
    root = '0',
    // 页面标题，显示在card上
    pageTitle = '',
    // js代码生成相关配置
    jsConfig = {},
    multiFiles = false
  } = options;
  if (multiFiles) {
    const { pageVNodes, ...vTrees } = transform.nejMulList(pageTitle, listConfig);
    const result = {
      modules: {}
    };
    let modules = '';
    for (let i in vTrees) {
      if (vTrees.hasOwnProperty(i)) {
        const vTree = vTrees[i];
        modules += `\n'./${vTree.moduleName}/index.js',`;
        result.modules[vTree.moduleName] = genList(vTree, {
          root,
          name: vTree.moduleName,
          url: vTree.url,
          ListPath: jsConfig.ListPath
        });
      }
    }
    result.index = genList(pageVNodes, { ListPath: jsConfig.basePath, modules });

    return result;
  }

  const vTree = transform.nejList(pageTitle, listConfig);

  return {
    [vTree.moduleName]: genList(vTree, {
      root,
      url: vTree.url,
      ListPath: jsConfig.ListPath
    })
  };
};
