import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/**
 * /app 下的为普通页面，包含顶部栏等公共组件
 */

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: { name: 'home' }
    },
    {
      path: '/app',
      components: {
        header: resolve => require(['@/components/layout/TopHeader.vue'], resolve),
        main: resolve => require(['@/components/layout/Main.vue'], resolve)
      },
      children: [
        {
          alias: 'home',
          path: '/',
          name: 'home',
          component: resolve => require(['@/pages/user/Home.vue'], resolve)
        }
      ]
    },
    {
      path: '/edit',
      name: 'edit',
      components: {
        header: resolve => require(['@/components/layout/TopHeader.vue'], resolve),
        main: resolve => require(['@/pages/user/Edit.vue'], resolve)
      }
    },
    {
      path: '*',
      name: '404',
      component: resolve => require(['@/pages/404'], resolve)
    }
  ],
});
