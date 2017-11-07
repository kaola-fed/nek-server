import Router from 'koa-router';
import Controllers from './../controllers/index';

const {HomeController, LoginController} = Controllers;

//子路由home
const Home = new Router();
Home.get('/', HomeController.index);

//子路由login
const Login = new Router();
Login.get('/', LoginController.index);

const routes = new Router();
routes.use('/', Home.routes(), Home.allowedMethods());
routes.use('/login', Login.routes(), Login.allowedMethods());

export default routes;
