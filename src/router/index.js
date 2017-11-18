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
      path: '/login',
      name: 'login',
      components: {
        body: resolve => require(['@/pages/app/auth/Login.vue'], resolve)
      }
    },
    {
      path: '/editor',
      components: {
        body: resolve => require(['@/components/layout/Body.vue'], resolve)
      },
      children: [
        {
          path: '',
          name: 'editor',
          component: resolve => require(['@/pages/editor/Editor.vue'], resolve)
        },
        {
          path: 'list',
          name: 'listTemplate',
          component: resolve => require(['@/pages/editor/templates/ListEditor.vue'], resolve)
        }
      ]
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
              path: 'detail',
              name: 'projectDetail',
              component: resolve => require(['@/pages/app/project/Project.vue'], resolve)
            }
          ]
        },
        {
          path: 'library',
          name: 'library',
          component: resolve => require(['@/components/layout/Main.vue'], resolve),
          children: [
            {
              path: 'detail',
              name: 'components',
              component: resolve => require(['@/pages/app/library/Library.vue'], resolve)
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
