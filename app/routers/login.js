import Router from 'koa-router';
import * as LoginController from './../controllers/login';
import Auth from '../middlewares/auth';
//子路由project
const route = new Router();

route.get('/', LoginController.index);
route.post('/logout', LoginController.logout);
route.post('/isLogin', Auth, LoginController.isLogin);
route.get('/gen', (ctx) => {
  return ctx.body = {
    code: 200,
    data: {
      url: '/backend/todolist/index',
      type: 2,
      ftl: 'ftlftllllll',
      entry: 'entryentryer',
      index: {
        js: 'indexjsindexjs',
        html: 'indexhtml indexhtml'
      },
      modules: {
        list: {
          js: 'list js list js',
          html: 'list html list html'
        }
      }
    }
  }
})
export default route;
