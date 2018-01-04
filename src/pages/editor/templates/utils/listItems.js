import NSNode from '@/../core/src/NSNode';

export const setListWithTemplate = (value, template) => {
  if (template.id) {
    delete template.id;
  }
  return value.map(el => ({ ...template, ...el }));
};

export const newBreadcrumbItem = () => {
  return {
    id: NSNode.generateId(),
    title: '',
    link: '',
    nodeId: null
  };
};

export const newTabItem = (key = 0) => {
  const count = key + 1;
  return {
    id: NSNode.generateId(),
    title: `tab${count}`,
    key: count || '',
    url: ''
  };
};

export const newListConfigItem = () => {
  return {
    moduleName: '',
    filters: [],
    buttons: [],
    cols: [],
    operatorCol: false,
    operatorButtons: []
  };
};

/* 列表中的配置项 */

export const newFilter = () => {
  return {
    title: '',
    key: '',
    type: 'kl-input',
    placeholder: '',
    sourceKey: ''
  };
};

export const newButton = () => {
  return {
    title: '',
    event: '',
    type: '',
  };
};

export const newCol = () => {
  return {
    name: '',
    key: '',
    type: '',
    fixed: '',
    filter: '',
    width: '100'
  };
};

export const newOperatorButton = () => {
  return {
    title: '',
    link: ''
  };
};

