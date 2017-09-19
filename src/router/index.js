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
      redirect: { name: 'dashboard' }
    },
    {
      path: '/editor',
      name: 'editor',
      components: {
        header: resolve => require(['@/components/layout/TopHeader.vue'], resolve),
        body: resolve => require(['@/pages/editor/Editor.vue'], resolve)
      }
    },
    {
      path: '/app',
      components: {
        header: resolve => require(['@/components/layout/TopHeader.vue'], resolve),
        body: resolve => require(['@/components/layout/Body.vue'], resolve)
      },
      children: [
        {
          path: '',
          component: resolve => require(['@/components/layout/Main.vue'], resolve),
          children: [
            {
              path: 'dashboard',
              name: 'dashboard',
              component: resolve => require(['@/pages/app/Home.vue'], resolve),
            }
          ]
        },
        {
          path: 'project',
          name: 'project',
          component: resolve => require(['@/components/layout/Main.vue'], resolve),
          children: [
            {
              path: 'setting',
              name: 'projectSetting',
              component: resolve => require(['@/pages/app/project/Setting.vue'], resolve)
            }
          ]
        }
      ]
    },
    {
      path: '*',
      name: '404',
      component: resolve => require(['@/pages/404'], resolve)
    }
  ],
});
