import Router from 'koa-router';

import HomeRoute from './home';
import ProjectRoute from './project';
import LoginRoute from './login';
import UserRoute from './user';

const routes = new Router();

routes.use('/api', HomeRoute.routes(), HomeRoute.allowedMethods());
routes.use('/api/login', LoginRoute.routes(), LoginRoute.allowedMethods());
routes.use('/api/project', ProjectRoute.routes(), ProjectRoute.allowedMethods());
routes.use('/api/user', UserRoute.routes(), UserRoute.allowedMethods());

// 最后匹配，GET 请求并且不是接口的就渲染页面，404交给页面来做
routes.get('(.*)', (ctx) => {
  if (!ctx.body && !/^\/api(\/.+|\/?)$/.test(ctx.request.url)) {
    return ctx.render('index');
  }
});

export default routes;
