import Regular from 'regularjs';
import { install } from 'nek-ui';

install(Regular);
// extend不带配置，保持纯净
const NekComponent = Regular.extend();
NekComponent.directive('r-nsid', (elem, value) => {
  //需要删除外层空div
  for(let i=0, len=elem.childNodes.length; i<len; i++) {
    if(elem.childNodes[i].nodeType == Node.ELEMENT_NODE) {
      elem.childNodes[i].setAttribute('ns-id', value);
    }
  }
});
// 添加静态函数，用于直接插入DOM中
NekComponent.inject = (tpl, parent) => {
  if (!parent) {
    throw new Error('Must provide a parent node');
  }

  const RootComponent = new NekComponent({
    template: tpl
  });
  RootComponent.$inject(parent);

  return RootComponent;
};

export default NekComponent;
