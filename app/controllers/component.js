const Router = require('koa-router');
const mongoose = require('mongoose');

const component = new Router();
const Component = mongoose.model('Component');
const Category = mongoose.model('Category');

component.get('/list', async ctx => {
  const { project } = ctx.query;
  let categories = await Category.getList();
  categories = JSON.parse(JSON.stringify(categories));
  for (let category of categories) {
    category.componentList = await Component.getList(project, category._id);
  }
  ctx.body = categories;
});

component.post('/upsert', async ctx => {
  const { _id, project } = ctx.request.body;
  ctx.body = await Component.upsert(_id, project, ctx.request.body);
});

module.exports = component.routes();
