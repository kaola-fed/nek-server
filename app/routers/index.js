import Router from 'koa-router';
import Controllers from './../controllers/index';

const {HomeController, LoginController, ProjectController} = Controllers;

//子路由home
const Home = new Router();
Home.get('/', HomeController.index);

//子路由login
const Login = new Router();
Login.get('/', LoginController.index);

//子路由project
const Project = new Router();
Project.get('/nei', ProjectController.nei);

const routes = new Router();
routes.use('/', Home.routes(), Home.allowedMethods());
routes.use('/login', Login.routes(), Login.allowedMethods());
routes.use('/api/project', Project.routes(), Project.allowedMethods());

export default routes;
