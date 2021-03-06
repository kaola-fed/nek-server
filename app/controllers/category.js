const Router = require('koa-router');
const mongoose = require('mongoose');

const category = new Router();
const Category = mongoose.model('Category');

category.get('/list', async ctx => {
  ctx.body = await Category.getList();
});

category.post('/upsert', async ctx => {
  const { category, name } = ctx.request.body;
  if (!name) {
    throw new Error('[name] is required');
  }
  ctx.body = await Category.upsert(category, name);
});

module.exports = category.routes();
