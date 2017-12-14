// import lodash from 'lodash';

import { ConditionTypes } from '../enums';

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

// 先不搞了，太麻烦，效果也不一定好
// // 找出多个数组中头尾不同的部分，合并成一个数组返回
// export const compareArrays = (arrays, isSame = lodash.isEqual) => {
//   // 计算并集，建立接邻矩阵
//   const union = lodash.unionWith(...arrays, isSame);
//   // 增加一个空的点，用来保证只有一个遍历的起点
//   const length = union.length + 1;
//   const graph = [...Array(length)].map(() => new Array(length).fill(null));
//
//   const maxLength = arrays.reduce((res, curr) => Math.max(res, curr.length), 0);
//   // 遍历数组集，创建图
//   for (let i = 0; i < maxLength; ++i) {
//     arrays.forEach((el) => {
//
//     });
//   }
// };
