import VNodeTree from '../VNodeTree';

export const nejList = (title, config) => {
  const { breadcrumbs, tabsEnable, lists } = config;
  const nsVNodes = new VNodeTree();

  // 添加面包屑
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
  breadObject.children = breadObject.children.concat(breadcrumbs.map(el => ({
    tagName: 'kl-crumb-item',
    attributes: { content: el.title, href: el.link }
  })));
  nsVNodes.addFromObject(breadObject, nsVNodes.rootId);

  if (tabsEnable) {
    // 暂不考虑多tab的情况
  }

  const list = lists[0];
  const { filters, buttons, cols, operatorCol, operatorButtons } = list;

  // 输入部分
  // 先不管kl-search
  const headObject = {
    tagName: 'kl-card',
    attributes: { title },
    children: [{
      tagName: 'kl-row',
      children: filters.map((el) => {
        const attributes = el.key ? {
          value: { type: 'var', value: `condition.${el.key}` }
        } : {};

        return {
          tagName: 'kl-col',
          attributes: { span: 4 },
          children: [{
            tagName: 'kl-form-item',
            attributes: { title: el.title },
            children: [{
              tagName: el.type,
              attributes
            }]
          }]
        };
      })
    }]
  };
  nsVNodes.addFromObject(headObject, nsVNodes.rootId);

  // 按钮及列表
  const listObject = {
    tagName: 'kl-card',
    attributes: { isShowLine: false },
    children: []
  };
  // 按钮
  if (buttons.length > 0) {
    listObject.children.push({
      tagName: 'kl-row',
      children: [{
        tagName: 'kl-col',
        attributes: { span: 4 },
        children: buttons.map((el) => {
          const options = { attributes: { title: el.title } };
          if (el.type && el.type !== 'default') {
            options.attributes.type = el.type;
          }
          if (el.event) {
            options.events = { click: el.event };
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
    attributes: { data: { type: 'var', value: 'list' } },
    children: cols.map((el) => {
      const attributes = {
        name: el.title,
        key: el.key
      };
      if (el.fixed) {
        attributes.fixed = el.fixed;
      }

      return {
        tagName: 'kl-table-col',
        attributes
      };
    })
  };
  if (operatorCol) {
    tableObject.children.push({
      tagName: 'kl-table-col',
      attributes: { fixed: 'right' },
      children: [{
        tagName: 'kl-table-template',
        children: [{
          text: `${operatorButtons.map(el => `{'<a href="${el.link}">${el.title}</a>'}`).join('\n')}`
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
      sumTotal: { type: 'var', value: 'sumTotal' },
      current: { type: 'var', value: 'current' },
    }
  });

  nsVNodes.addFromObject(listObject, nsVNodes.rootId);

  // 将基类中的变量和事件放进去
  // TODO: 配置这几个变量？
  nsVNodes.excludeVar = new Set(['list', 'pageSize', 'sumTotal', 'current']);
  nsVNodes.excludeEvent = new Set(['refresh', 'reset']);

  nsVNodes.$apply();
  return nsVNodes;
};
