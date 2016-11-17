const Router = require('koa-router');
const mongoose = require('mongoose');

const test = new Router();

const Category = mongoose.model('Category');

test.post('/addCategory', async ctx => {
  const { name } = ctx.request.body;
  ctx.body = name;
});

module.exports = test.routes();