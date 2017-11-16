import Router from 'koa-router';
import * as LoginController from './../controllers/login';
import Auth from '../middlewares/auth';
//子路由project
const route = new Router();

route.get('/', LoginController.index);
route.get('/logout', LoginController.logout);
route.post('/isLogin', Auth, LoginController.isLogin);

export default route;
