import Router from 'koa-router';
import * as ProjectControllers from './../controllers/project';
import Auth from '../middlewares/auth';

//子路由project
const route = new Router();
route.get('/nei', Auth, ProjectControllers.nei);

export default route;
