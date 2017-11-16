import Router from 'koa-router';
import * as ProjectControllers from './../controllers/project';

//子路由project
const route = new Router();
route.get('/nei', ProjectControllers.nei);

export default route;
