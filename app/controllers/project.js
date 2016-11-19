const Router = require('koa-router');
const mongoose = require('mongoose');

const project = new Router();
const Project = mongoose.model('Project');

project.get('/', async ctx => {
  const { projectId } = ctx.query;
  ctx.body = await Project.queryOne(projectId);
});

project.get('/list', async ctx => {
  ctx.body = await Project.getList();
});

project.post('/upsert', async ctx => {
  const { projectId, name, desc } = ctx.request.body;
  ctx.body = await Project.upsert(projectId, name, desc);
});

project.post('/tpl/upsert', async ctx => {
  const { projectId, name, fileId } = ctx.request.body;
  ctx.body = await Project.upsertTpl(projectId, name, fileId);
});

project.post('/tpl/delete', async ctx => {
  const { projectId, name } = ctx.request.body;
});

module.exports = project.routes();
