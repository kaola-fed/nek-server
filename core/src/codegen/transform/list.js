import VNodeTree from '../../VNodeTree';
import {ConditionTypes} from '../../enums';

// 面包屑节点
function getBreadNode(breads) {
  const breadObject = {
    tagName: 'kl-crumb',
    children: [{
      tagName: 'kl-crumb-item',
      children: [{
        tagName: 'kl-icon',
        attributes: { type: 'home2', color: '#E31436' }
      }]
    }]
  };
  breadObject.children = breadObject.children.concat(breads.map(el => ({
    tagName: 'kl-crumb-item',
    attributes: { content: el.title, href: el.link }
  })));

  return breadObject;
}

// 多Tab节点
function getTabsNode(tabs) {
  return {
    tagName: 'kl-tabs',
    events: { change: 'onTabChange' },
    children: tabs.map(el => ({
      tagName: 'kl-tab',
      attributes: { key: el.key }
    }))
  };
}

// 获取单独一个搜索项
function getSearchItem(item) {
  return {
    tagName: 'kl-col',
    attributes: { span: 4 },
    children: [{
      tagName: 'kl-form-item',
      attributes: { title: item.title },
      children: [{
        tagName: item.type,
        attributes: item.key ? { value: { type: 'var', value: `condition.${item.key}` } } : {}
      }]
    }]
  };
}

// 获取一个Tab下的搜索项
function getSearchItems(filters) {
  const result = [];
  const rowNode = { tagName: 'kl-row', children: [] };
  let searchMoreRowNode = null;

  filters.forEach((el, index) => {
    // 第四个的时候建立kl-search-more里的row
    if (index === 3) {
      searchMoreRowNode = { tagName: 'kl-row', children: [] };
    }

    if (index < 3) {
      // 前四个放在第一行
      rowNode.children.push(getSearchItem(el));
    } else {
      // 第四个开始放进kl-search-more的row中
      searchMoreRowNode.children.push(getSearchItem(el));
    }
  });

  if (filters.length < 3) {
    // 两个及以内的时候push搜索和重置按钮进去
    rowNode.children.push({
      tagName: 'kl-col',
      children: [{
        tagName: 'kl-form-item',
        children: [{
          tagName: 'kl-button',
          attributes: { title: '查询', type: 'secondary' },
          events: { click: 'refresh' }
        }, {
          tagName: 'kl-button',
          attributes: { title: '重置' },
          events: { click: 'reset' }
        }]
      }]
    });
  }

  result.push(rowNode);
  if (searchMoreRowNode) {
    result.push({
      tagName: 'kl-search-more',
      children: [searchMoreRowNode]
    });
  }

  return result;
}

// 生成搜索区节点
function getSearchNode(filters) {
  // 找出最长的label，按一个字宽15px算
  const maxLength = filters.reduce((max, current) => {
    return Math.max(max, current.title.length);
  }, 0);

  // TODO: 用computed控制isShowFooter和isShowToggle
  return {
    tagName: 'kl-card',
    attributes: { isShowLine: false },
    children: [{
      tagName: 'kl-form',
      attributes: { labelSize: maxLength * 15 },
      children: [{
        tagName: 'kl-search',
        events: { search: 'refresh', reset: 'reset' },
        children: getSearchItems(filters)
      }]
    }]
  };
}

// 生成单个按钮
function getButtons(buttons) {
  return buttons.map((el) => {
    const { event, ...attributes } = el;
    const options = { tagName: 'kl-button', attributes };
    if (!el.type || el.type === 'default') {
      delete options.attributes.type;
    }
    if (el.event) {
      options.events = { click: event };
    }
    return options;
  });
}

// 按钮节点
function getButtonsNode(buttons) {
  // 按钮可能不存在
  return buttons.length > 0 ? {
    tagName: 'kl-row',
    attributes: { gutter: 0 },
    children: getButtons(buttons)
  } : null;
}

// 列
function getCols(cols) {
  return cols.map((el) => {
    if (el.hasOwnProperty('typeName')) {
      // 生成代码时删除typeName属性
      delete el.typeName;
    }
    const { template, ...attributes } = el;
    const res = {
      tagName: 'kl-table-col',
      attributes
    };
    if (template) {
      res.children = [{
        tagName: 'kl-table-template',
        children: [{ text: template }]
      }];
    }

    return res;
  });
}

// 表格节点
function getTableNode(cols) {
  return {
    tagName: 'kl-row',
    attributes: { gutter: 0 },
    children: [{
      tagName: 'kl-table',
      attributes: {source: {type: 'var', value: 'list'}},
      children: getCols(cols)
    }]
  };
}

// 分页
function getPagerNode() {
  return {
    tagName: 'kl-pager',
    attributes: {
      pageSize: { type: 'var', value: 'pageSize' },
      sumTotal: { type: 'var', value: 'total' },
      current: { type: 'var', value: 'pageNo' },
    }
  };
}

// 生成一个列表下搜索区、按钮及表格
function getListNodes(config) {
  let searches = [], buttons = [], tables = [];

  searches.push(config.filters);
  buttons.push(config.buttons);

  const cols = config.cols;
  if (config.operatorCol) {
    cols.push({
      name: '操作',
      width: '100',
      template: `${config.operatorButtons.map((el, index) => {
        return `{'<a href="${el.link}" target="_blank" ${ index > 0 ? 'class="f-ml10"' : ''}>${el.title}</a>'}`;
      }).join('\n')}`
    });
  }
  tables.push(cols);

  return {
    searchNode: getSearchNode(config.filters),
    buttonsNode: getButtonsNode(config.buttons),
    tablesNode: getTableNode(cols)
  };
}

// 组装表格card
function assemblyLTable(buttonsNode, tablesNode) {
  const tableObj = {
    tagName: 'kl-card',
    attributes: { isShowLine: false },
    children: [tablesNode, getPagerNode()]
  };
  if (buttonsNode) {
    tableObj.children.unshift(buttonsNode);
  }

  return tableObj;
}

// 单文件
export const rgList = (title, config) => {
  const { breadcrumbs, tabs, lists } = config;
  const nsVNodes = new VNodeTree();

  // 添加面包屑
  nsVNodes.addFromObject(getBreadNode(breadcrumbs));

  const { searchNode, buttonsNode, tablesNode } = getListNodes(lists[0]);
  nsVNodes.addFromObject(searchNode);
  nsVNodes.addFromObject(assemblyLTable(buttonsNode, tablesNode));

  // 将基类中的变量和事件放进去
  // TODO: 配置这几个变量？
  nsVNodes.excludeVar = new Set(['source', 'pageSize', 'sumTotal', 'current']);
  nsVNodes.excludeEvent = new Set(['refresh', 'reset']);
  nsVNodes.url = tabs[0].url;
  nsVNodes.cols = lists[0].cols;
  nsVNodes.$apply();
  return nsVNodes;
};

// 根据tabs生成list节点
function getMulListNode(tabs) {
  const nodes = tabs.map(el => ({ tagName: el.moduleName }));
  let res = [];

  if (nodes.length > 1) {
    nodes.forEach((el, index) => {
      const condition = {
        type: index ? ConditionTypes.ELSEIF : ConditionTypes.IF,
        exp: `tab === ${el.key}`
      };
      res.push(condition);
      res.push(nodes[index]);
    });
    nodes.push({ type: ConditionTypes.ENDIF });
  } else {
    res = nodes;
  }

  return {
    tagName: 'div',
    children: res
  };
}

// 多文件
export const rgMulList = (title, config) => {
  const { breadcrumbs, tabs, lists } = config;
  // page.js
  const pageVNodes = new VNodeTree();
  pageVNodes.moduleName = 'page';

  const names = new Set();
  lists.forEach(el => el.moduleName && names.add(el.moduleName));

  // 列表模块生成
  const modules = {};
  lists.forEach((el, index) => {
    let { moduleName, ...config } = el;
    // 没有配置模块名，则自动生成为 list + n
    if (!moduleName) {
      moduleName = 'list';
      let count = '';
      while (names.has(moduleName + count)) {
        count = +(count + 1);
      }
      moduleName += count;
    }

    if (modules[moduleName]) {
      return;
    }

    // 配置子模块
    const tmp = new VNodeTree();
    tmp.moduleName = moduleName;
    tabs[index].moduleName = moduleName;
    pageVNodes.subModules.push(moduleName);

    const nodes = getListNodes(config);
    const { searchNode, buttonsNode, tablesNode } = nodes;
    searchNode.attributes.class = 'f-undertab';
    tmp.addFromObject(searchNode);
    tmp.addFromObject(assemblyLTable(buttonsNode, tablesNode));
    tmp.excludeVar = new Set(['source', 'pageSize', 'sumTotal', 'current']);
    tmp.excludeEvent = new Set(['refresh', 'reset']);

    tmp.url = tabs[index].url;
    tmp.cols = el.cols;
    tmp.$apply();
    modules[moduleName] = tmp;
  });

  // 配置公共部分
  pageVNodes.addFromObject(getBreadNode(breadcrumbs));
  pageVNodes.addFromObject(getTabsNode(tabs));

  // 加上列表
  pageVNodes.addFromObject(getMulListNode(tabs));

  pageVNodes.data.tab = tabs[0].key;
  pageVNodes.$apply();
  return {
    ...modules,
    pageVNodes
  };
};
