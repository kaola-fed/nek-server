const Router = require('koa-router');
const mongoose = require('mongoose');

const component = new Router();
const Component = mongoose.model('Component');

component.get('/list', async ctx => {
  const { project } = ctx.query;
  ctx.body = await Component.getList(project);
});

component.post('/upsert', async ctx => {
  const { _id, project } = ctx.request.body;
  ctx.body = await Component.upsert(_id, project, ctx.request.body);
});

module.exports = component.routes();
