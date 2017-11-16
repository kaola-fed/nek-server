import Router from 'koa-router';

import * as ProjectControllers from '../controllers/project';
import Auth from '../middlewares/auth';

//子路由project
const route = new Router();
route.use(Auth);

route.get('/create', ProjectControllers.create);
route.get('/list', ProjectControllers.getList);
route.get('/update', ProjectControllers.update);
route.get('/detail', ProjectControllers.detail);
route.get('/nei', ProjectControllers.nei);

export default route;
