import Regular from 'regularjs';
import { install } from 'nek-ui';

install(Regular);
// extend不带配置，保持纯净
const NekComponent = Regular.extend();
NekComponent.directive('r-nsid', (elem, value) => {
  const event = new CustomEvent('insertNsid', {
    detail: {
      nsid: value,
      elem
    }
  });
  document.getElementById('ns-preview').dispatchEvent(event);
});
// 添加静态函数，用于直接插入DOM中
NekComponent.inject = (tpl, parent, options) => {
  if (!parent) {
    throw new Error('Must provide a parent node');
  }

  const RootComponent = new NekComponent({
    ...options,
    template: tpl
  });
  RootComponent.$inject(parent);

  return RootComponent;
};

export default NekComponent;
