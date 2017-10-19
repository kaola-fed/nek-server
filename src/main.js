// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

// 插件等
import VueMoment from 'vue-moment';
import Element from 'element-ui';
import App from './App.vue';
import router from './router';
import Custom from '@/widget/custom';
import store from './store';

// 样式
import 'element-kaola/index.css';
import '@/style/index.css';
import 'nek-ui/dist/css/nek-ui.default.min.css';

// 统一处理未catch的Error;
window.onunhandledrejection = (event) => {
  event.stopPropagation();
  event.preventDefault();
};

Vue.use(Element);
Vue.use(VueMoment);
Vue.use(Custom);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
