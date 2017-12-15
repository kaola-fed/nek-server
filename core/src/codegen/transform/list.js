import lodash from 'lodash';

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
      tagName: 'el-tab',
      attributes: { key: el.key }
    }))
  };
}

// 比较出完全不同的数组，返回索引
function compareArrays(arrays, comparator = lodash.isEqual) {
  const result = [];
  const tpl = arrays[0];
  for (let i = 1; i < arrays.length; ++i) {
    if (lodash.differenceWith(tpl, arrays[i], comparator).length > 0) {
      result.push(i);
    }
  }
  // 第一个作为模板，也就是else，所以放最后
  result.push(0);
  return result;
}

// 合并多个数组，并加入if-elseif-else
// TODO: 差异分组
function diffAndMergeArrays(keys, arrays, getItems) {
  if (!getItems) {
    throw new Error('[Miss "getItems"] Need to provide a function to generate items.');
  }

  const diffIndexes = compareArrays(arrays);
  const finalFilterNodes = diffIndexes.map(el => getItems(arrays[el]));

  if (finalFilterNodes.length > 1) {
    // 加入 if-elseif-else
    let children = [];
    finalFilterNodes.forEach((el, index) => {
      let condition;
      switch (index) {
        case 0:
          condition = { type: ConditionTypes.IF, exp: `currentTab === '${keys[diffIndexes[0]]}'` };
          break;
        case finalFilterNodes.length - 1:
          condition = { type: ConditionTypes.ELSEIF, exp: `currentTab === '${keys[diffIndexes[index]]}'` };
          break;
        default:
          condition = {type: ConditionTypes.ELSE};
      }
      children.push({ condition });
      children = children.concat(el);
    });
    children.push({ condition: { type: ConditionTypes.ENDIF } });
    return children;
  }

  // 单个的，直接塞进去
  return finalFilterNodes[0];
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

// keys = ['key1', 'key2', ...]
// multiFilters = [[filters1], [filters2], ...]
// 早知道就用TS了
function getSearchNode(keys, multiFilters) {
  // TODO: 用computed控制isShowFooter和isShowToggle
  return {
    tagName: 'kl-card',
    attributes: { isShowLine: false },
    children: [{
      tagName: 'kl-search',
      events: { search: 'refresh', reset: 'reset' },
      children: diffAndMergeArrays(keys, multiFilters, getSearchItems)
    }]
  };
}

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

// 参数参考getSearchNode
function getButtonsNode(keys, multiButtons) {
  // 按钮可能不存在
  const children = diffAndMergeArrays(keys, multiButtons, getButtons);
  return children.length > 0 ? {
    tagName: 'kl-row',
    attributes: { gutter: 0 },
    children
  } : null;
}

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

function getTablesNode(keys, cols) {
  return {
    tagName: 'kl-row',
    attributes: { gutter: 0 },
    children: [{
      tagName: 'kl-table',
      attributes: {source: {type: 'var', value: 'list'}},
      children: diffAndMergeArrays(keys, cols, getCols)
    }]
  };
}

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

// 获取多Tab的列表节点
function getListsNodes(tabs, configs) {
  let keys = [], searches = [], buttons = [], tables = [];
  configs.forEach((el, index) => {
    keys.push(tabs[index].key);
    searches.push(el.filters);
    buttons.push(el.buttons);

    const cols = el.cols;
    if (el.operatorCol) {
      cols.push({
        name: '操作',
        width: '100',
        template: `${el.operatorButtons.map((el, index) => {
          return `{'<a href="${el.link}" target="_blank" ${ index > 0 ? 'class="f-ml10"' : ''}>${el.title}</a>'}`;
        }).join('\n')}`
      });
    }
    tables.push(cols);
  });

  const searchNode = getSearchNode(keys, searches);
  const buttonsNode = getButtonsNode(keys, buttons);
  const tablesNode = getTablesNode(keys, tables);

  return { searchNode, buttonsNode, tablesNode };
}

// 单文件
export const nejList = (title, config) => {
  const { breadcrumbs, tabsEnable, tabs, lists } = config;
  const nsVNodes = new VNodeTree();

  // 添加面包屑
  nsVNodes.addFromObject(getBreadNode(breadcrumbs), nsVNodes.rootId);

  // 根据是否启用多Tab生成不同数据
  let nodes;
  if (tabsEnable) {
    nsVNodes.addFromObject(getTabsNode(tabs), nsVNodes.rootId);
    nodes = getListsNodes(tabs, lists);
    nodes.searchNode.attributes = { class: 'f-undertab' };
  } else {
    nodes = getListsNodes([tabs[0]], [lists[0]]);
  }

  const { searchNode, buttonsNode, tablesNode } = nodes;
  nsVNodes.addFromObject(searchNode, nsVNodes.rootId);
  const tableObj = {
    tagName: 'kl-card',
    attributes: { isShowLine: false },
    children: [tablesNode, getPagerNode()]
  };
  if (buttonsNode) {
    tableObj.children.unshift(buttonsNode);
  }
  nsVNodes.addFromObject(tableObj, nsVNodes.rootId);

  // 将基类中的变量和事件放进去
  // TODO: 配置这几个变量？
  nsVNodes.excludeVar = new Set(['source', 'pageSize', 'sumTotal', 'current']);
  nsVNodes.excludeEvent = new Set(['refresh', 'reset']);

  nsVNodes.$apply();
  return nsVNodes;
};
