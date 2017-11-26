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
      attr += ` on-${i}={this.${events[i]}($event)`;
    }
  }

  return attr;
};
