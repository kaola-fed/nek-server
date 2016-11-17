const Router = require('koa-router');
const mongoose = require('mongoose');

const component = new Router();

component.get('/', async ctx => {
  ctx.body = 'component';
});

module.exports = component.routes();
