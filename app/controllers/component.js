const Router = require('koa-router');
const mongoose = require('mongoose');

const component = new Router();
const Component = mongoose.model('Component');
const Category = mongoose.model('Category');

component.get('/list', async ctx => {
  const { projectId } = ctx.query;
  let categories = await Category.getList();
  categories = JSON.parse(JSON.stringify(categories));
  for (let category of categories) {
    category.componentList = await Component.getList(projectId, category._id);
  }
  ctx.body = categories;
});

component.post('/upsert', async ctx => {
  const { componentId, projectId } = ctx.request.body;
  ctx.body = await Component.upsert(componentId, projectId, ctx.request.body);
});

module.exports = component.routes();
