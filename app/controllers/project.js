const Router = require('koa-router');
const mongoose = require('mongoose');

const project = new Router();
const Project = mongoose.model('Project');

project.get('/list', async ctx => {
  ctx.body = await Project.getList();
});

project.post('/upsert', async ctx => {
  const { _id, name, desc } = ctx.request.body;
  ctx.body = await Project.upsert(_id, name, desc);
});

project.post('/tpl/upsert', async ctx => {
  const { _id, name, file } = ctx.request.body;
  ctx.body = await Project.upsertTpl(_id, name, file);
});

project.post('/tpl/delete', async ctx => {
  const { _id, name } = ctx.request.body;
});

module.exports = project.routes();
