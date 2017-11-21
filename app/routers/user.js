import Router from 'koa-router';

import * as UserController from '../controllers/user';
import Auth from '../middlewares/auth';

import * as _ from '../utils/response';

// 子路由project
const route = new Router();
route.use(Auth);
route.get('/dashboard', async (ctx) => {
  const projects = UserController.dashboard(ctx.session.user.username);
  ctx.body = _.success({ projects });
});

export default route;
