import VNodeTree from '../VNodeTree';

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

function getSearchNode(filters) {
  const searchObject = {
    tagName: 'kl-search',
    attributes: {},
    children: [{ tagName: 'kl-row', children: [] }]
  };
  filters.forEach((el, index) => {
    // 第七个的时候建立kl-search-more
    if (index === 6) {
      searchObject.children.push({
        tagName: 'kl-search-more',
        children: [{ tagName: 'kl-row', children: [] }]
      });
    }
    if (index < 6) {
      // 前六个放在第一行
      // 我也不想这么写的，都是生活所迫，加个标记就当什么都没发生吧
      // (kl-s   > kl-row    )
      searchObject.children[0].children.push(getSearchItem(el));
    } else {
      // 第七个开始放进kl-search-more中
      // (kl-s   > kl-s-m    > kl-row    )
      searchObject.children[1].children[0].children.push(getSearchItem(el));
    }
  });

  // 搜索重置按钮设置
  if (filters.length < 3) {
    searchObject.attributes.isShowFooter = false;
    // 两个及以内的时候push搜索和重置按钮进去
    // (kl-s   > kl-row    )
    searchObject.children[0].children.push({
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
  } else {
    // 七个及以上的时候控制一下toggle显示就好
    searchObject.events = { search: 'refresh', reset: 'reset' };
    if (filters.length === 6) {
      searchObject.attributes.isShowToggle = false;
    }
  }
  return searchObject;
}

function getTableNode(list) {
  const { buttons, cols, operatorCol, operatorButtons } = list;
  const listObject = {
    tagName: 'kl-card',
    attributes: { isShowLine: false },
    children: []
  };
  // 按钮
  if (buttons.length > 0) {
    listObject.children.push({
      tagName: 'kl-row',
      attributes: { class: 'f-mb10' },
      children: [{
        tagName: 'kl-col',
        // attributes: { span: 4 },
        children: buttons.map((el) => {
          const { event, ...attributes } = el;
          const options = { attributes };
          if (!el.type || el.type === 'default') {
            delete options.attributes.type;
          }
          if (el.event) {
            options.events = { click: event };
          }

          return {
            tagName: 'kl-button',
            ...options
          };
        })
      }]
    });
  }
  // 列表
  const tableObject = {
    tagName: 'kl-table',
    attributes: { source: { type: 'var', value: 'list' } },
    children: cols.map((el) => {
      // 生成代码时删除typeName属性
      // TODO: 修改typeName位置，最好增加一个地方来存放这些配置
      delete el.typeName;
      return {
        tagName: 'kl-table-col',
        attributes: el
      };
    })
  };
  if (operatorCol) {
    tableObject.children.push({
      tagName: 'kl-table-col',
      attributes: { name: '操作', fixed: 'right' },
      children: [{
        tagName: 'kl-table-template',
        children: [{
          text: `${operatorButtons.map((el, index) => {
            return `{'<a href="${el.link}" target="_blank" ${ index > 0 ? 'class="f-ml10"' : ''}>${el.title}</a>'}`;
          }).join('\n')}`
        }]
      }]
    });
  }
  listObject.children.push(tableObject);

  // 分页
  listObject.children.push({
    tagName: 'kl-pager',
    attributes: {
      pageSize: { type: 'var', value: 'pageSize' },
      sumTotal: { type: 'var', value: 'total' },
      current: { type: 'var', value: 'pageNo' },
    }
  });

  return listObject;
}

export const nejList = (title, config) => {
  const { breadcrumbs, tabsEnable, lists } = config;
  const nsVNodes = new VNodeTree();

  // 添加面包屑
  nsVNodes.addFromObject(getBreadNode(breadcrumbs), nsVNodes.rootId);

  if (tabsEnable) {
    // 暂不考虑多tab的情况
  }

  const list = lists[0];

  // 输入部分
  nsVNodes.addFromObject({
    tagName: 'kl-card',
    attributes: { title },
    children: [getSearchNode(list.filters)]
  }, nsVNodes.rootId);

  // 按钮及列表
  nsVNodes.addFromObject(getTableNode(list), nsVNodes.rootId);

  // 将基类中的变量和事件放进去
  // TODO: 配置这几个变量？
  nsVNodes.excludeVar = new Set(['source', 'pageSize', 'sumTotal', 'current']);
  nsVNodes.excludeEvent = new Set(['refresh', 'reset']);

  nsVNodes.$apply();
  return nsVNodes;
};
