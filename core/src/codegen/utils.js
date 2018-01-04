import { ConditionTypes } from '../enums';
import * as transform from './transform/list';

const getAttrStr = (key, type, value, debug) => {
  if (value === '') {
    return '';
  }

  switch (type) {
    case 'string':
    case 'number':
      return ` ${key}="${value}"`;
    case 'boolean':
    case 'object':
      return ` ${key}={${value}}`;
    case 'var':
    case 'express':
      if (debug) {
        return '';
      }
      return ` ${key}={${value}}`;
    default:
      throw new Error('Unknown attribute type!');
  }
};

export const getAttributesStr = (attributes, debug, varMap) => {
  let result = '';
  for (let key in attributes) {
    if (attributes.hasOwnProperty(key)) {
      const attr = attributes[key];
      if (attr == null) {
        continue;
      }

      const type = attr.type || typeof attr;
      const value = attr.value || attr;
      result += getAttrStr(key, type, value, debug);
      // 记录变量名
      if (!debug && type === 'var' && varMap) {
        varMap.set(key, value);
      }
    }
  }

  return result;
};

export const getEventsStr = (events, eventSet) => {
  let attr = '';
  for (let i in events) {
    if (events.hasOwnProperty(i)) {
      eventSet && eventSet.add(events[i]);
      attr += ` on-${i}={this.${events[i]}($event)}`;
    }
  }

  return attr;
};

export const genMockData = (cols) => {
  const item = {};
  const timeTypeReg = /time$/i;
  cols.forEach((el) => {
    let value;
    // 只处理这三种
    switch ((el.typeName || '').toLowerCase()) {
      case 'boolean':
        value = true;
        break;
      case 'number':
        value = timeTypeReg.test(el.key) ? value = +new Date() : Math.ceil(Math.random() * 100);
        break;
      case 'string':
      default:
        value = el.name || '-';
    }
    item[el.key] = value;
  });

  const result = [];
  for (let i = 0; i < 10; ++i) {
    result.push({ id: i, ...item });
  }
  return result;
};

export const genHTML = (tree, nodeId, { eventSet, varMap, level = 0 }) => {
  const vNode = tree[nodeId];

  const { tagName, condition, attributes, events, children, text } = vNode;

  const intend = new Array(level * 4).fill(' ').join('');

  if (tagName) {
    // 添加属性并记录对应值
    const attrStr = getAttributesStr(attributes, false, varMap);
    // 添加事件并记录事件名
    const eventStr = getEventsStr(events, eventSet);

    return `${intend}<${tagName}${attrStr}${eventStr}>` +
      `${children.length
        ? `\n${children.map(el => genHTML(tree, el, { eventSet, varMap, level: level + 1 })).join('\n')}\n${intend}`
        : ''}` +
      `</${tagName}>`;
  }

  if (condition) {
    let conditionStr = '';
    const { type, exp } = condition;
    switch (type) {
      case ConditionTypes.IF:
      case ConditionTypes.ELSEIF:
        conditionStr = `#${type} ${exp}`;
        break;
      case ConditionTypes.ELSE:
        conditionStr = '#else';
        break;
      case ConditionTypes.ENDIF:
        conditionStr = '/if';
        break;
      default:
        break;
    }
    if (conditionStr) {
      return `${intend}{${conditionStr}}`;
    }
  }

  return `${intend}${text || ''}`;
};

function genList(vTree, genJSFunc, config) {
  const {
    root = '0',
    url = '',
    ListPath = '',
    fileName = 'index',
    // mixin位置，false为模块内
    outMixin = false,
    isNeedMixin = true
  } = config;

  const eventSet = new Set();
  // 默认加入的变量
  const varMap = new Map(Object.entries(vTree.data));
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
    mock.data.list = genMockData(vTree.cols);
    mock = JSON.stringify(mock);
  } else {
    mock = null;
  }
  const html = genHTML(vTree.tree, root, { eventSet, varMap });

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

  const { js, mixin } = genJSFunc({
    basePath: ListPath,
    eventSet,
    varMap,
    modules: vTree.subModules,
    moduleName: vTree.moduleName,
    fileName,
    outMixin,
    isNeedMixin,
  });

  return { js, mixin, html, url, mock };
}

// 生成列表页
export const buildList = (listConfig, genJSFunc, options) => {
  const {
    root = '0',
    // 页面标题，显示在card上
    pageTitle = '',
    // js代码生成相关配置
    jsConfig = {}
  } = options;

  if (listConfig.tabsEnable) {
    // 不建立多list，删除其他list，只保留第一个list
    if (!listConfig.multiListEnable) {
      listConfig.lists.splice(1, listConfig.lists.length - 1);
    }
    // 只有一个list时，将mixins放在外层
    let outMixin = listConfig.lists.length > 1 ? false : true;
    const { pageVNodes, ...vTrees } = transform.rgMulList(pageTitle, listConfig);
    const result = {
      modules: {}
    };

    for (let moduleName in vTrees) {
      if (vTrees.hasOwnProperty(moduleName)) {
        const vTree = vTrees[moduleName];

        result.modules[moduleName] = genList(vTree, genJSFunc, {
          root,
          outMixin,
          url: vTree.url,
          ListPath: jsConfig.ListPath
        });
      }
    }

    result.index = genList(pageVNodes, genJSFunc, {
      fileName: 'page',
      ListPath: jsConfig.basePath,
      isNeedMixin: false
    });

    return result;
  }

  const vTree = transform.rgList(pageTitle, listConfig);

  return {
    [vTree.moduleName]: genList(vTree, genJSFunc, {
      root,
      url: vTree.url,
      fileName: 'page',
      ListPath: jsConfig.ListPath,
      isNeedMixin: false
    })
  };
};
