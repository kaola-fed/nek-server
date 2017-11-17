import Router from 'koa-router';
import * as UserController from './../controllers/user';
import Auth from '../middlewares/auth';
//子路由project
const route = new Router();
route.use(Auth);
route.get('/dashboard', UserController.dashboard);

export default route;
