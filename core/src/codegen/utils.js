const getAttrStr = (key, type, value, debug) => {
  switch (type) {
    case 'string':
      return ` ${key}="${value}"`;
    case 'boolean':
    case 'number':
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

export const getAttributesStr = (attributes, debug, varSet) => {
  let attr = '';
  for (let i in attributes) {
    if (attributes.hasOwnProperty(i)) {
      if (attributes[i] == null) {
        continue;
      }

      const type = attributes[i].type || typeof attributes[i];
      const value = attributes[i].value || attributes[i];
      attr += getAttrStr(i, type, value, debug);
      // 记录变量名
      if (!debug && type === 'var' && varSet) {
        varSet.add(value);
      }
    }
  }

  return attr;
};

export const getEventsStr = (events) => {
  let attr = '';
  for (let i in events) {
    if (events.hasOwnProperty(i)) {
      attr += ` on-${i}={this.${events[i]}($event)`;
    }
  }

  return attr;
};
