import Router from 'koa-router';
import Controllers from '../controllers/index';
import Auth from '../middlewares/auth';

const { HomeController, LoginController } = Controllers;

const route = new Router();
route.get('/openid', HomeController.index);
route.get('/api/login', LoginController.index);
route.post('/api/isLogin', Auth, (ctx) => {
  return ctx.body = {
    code: 200,
    data: ctx.session.user
  };
});

export default route;
