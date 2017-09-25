const genAttributes = (attributes) => {
  let res = '';
  for (let i in attributes) {
    if (attributes.hasOwnProperty(i)) {
      const { type, value } = attributes[i];
      if (type === 'string') {
        res += ` ${i}="${value}"`;
      } else {
        res += ` ${i}={${value}}`;
      }
    }
  }

  return res;
};

const genRegularTemplate = (vNodeTree, vNode = null) => {
  vNode = vNode || vNodeTree['0'];

  const { tagName, attributes, children } = vNode;
  return `<${tagName}${genAttributes(attributes)}>${children.map(el => genRegularTemplate(vNodeTree, vNodeTree[el])).join('')}</${tagName}>`;
};

export default genRegularTemplate;
