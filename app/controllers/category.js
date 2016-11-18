const Router = require('koa-router');
const mongoose = require('mongoose');

const category = new Router();
const Category = mongoose.model('Category');

category.get('/list', async ctx => {
  ctx.body = await Category.getList();
});

category.post('/upsert', async ctx => {
  const { _id, name } = ctx.request.body;
  ctx.body = await Category.upsert(_id, name);
});

module.exports = category.routes();
