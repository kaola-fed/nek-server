import Router from 'koa-router';
import Controllers from '../controllers/index';

const { HomeController } = Controllers;

const route = new Router();
route.get('/openid', HomeController.index);

export default route;
