// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueMoment from 'vue-moment';
import Element from 'element-ui';
import App from './App.vue';
import router from './router';
import 'element-kaola/index.css';
import '@/style/index.css';
import 'nek-ui/dist/css/nek-ui.default.min.css';

Vue.use(Element);
Vue.use(VueMoment);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
