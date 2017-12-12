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
