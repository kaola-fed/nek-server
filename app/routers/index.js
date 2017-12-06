import Router from 'koa-router';

import ProjectRoute from './project';
import LoginRoute from './login';
import UserRoute from './user';
import LibraryRoute from './library';
import PageRoute from './page';
import PublicRoute from './public';
import KeyRoute from './key';

const routes = new Router();

routes.use('/api/login', LoginRoute.routes(), LoginRoute.allowedMethods());
routes.use('/api/project', ProjectRoute.routes(), ProjectRoute.allowedMethods());
routes.use('/api/user', UserRoute.routes(), UserRoute.allowedMethods());
routes.use('/api/library', LibraryRoute.routes(), LibraryRoute.allowedMethods());
routes.use('/api/page', PageRoute.routes(), PageRoute.allowedMethods());
routes.use('/api/public', PublicRoute.routes(), PublicRoute.allowedMethods());
routes.use('/api/key', KeyRoute.routes(), KeyRoute.allowedMethods());

// 最后匹配，GET 请求并且不是接口的就渲染页面，404交给页面来做
routes.get('(.*)', (ctx) => {
  if (ctx.body) {
    return;
  }
  if (/^\/api(\/.+|\/?)$/.test(ctx.request.url)) {
    ctx.body = '{ "code": 404, "message": "Unknown API." }';
  } else {
    return ctx.render('index');
  }
});

export default routes;
