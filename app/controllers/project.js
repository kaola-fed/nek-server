const Router = require('koa-router');
const mongoose = require('mongoose');

const project = new Router();
const Project = mongoose.model('Project');

project.get('/', async ctx => {
  const { project } = ctx.query;
  if (!project) {
    throw new Error('[project] is required');
  }
  ctx.body = await Project.queryOne(project);
});

project.get('/list', async ctx => {
  ctx.body = await Project.getList();
});

project.post('/upsert', async ctx => {
  const { project, name, desc } = ctx.request.body;
  if (!name) {
    throw new Error('[name] is required');
  }
  ctx.body = await Project.upsert(project, name, desc);
});

project.post('/tpl/upsert', async ctx => {
  const { project, name, file, type } = ctx.request.body;
  if (!project || !name || !file) {
    throw new Error('[project && name && file] are required');
  }
  ctx.body = await Project.upsertTpl(project, name, file, type);
});

project.post('/tpl/delete', async ctx => {
  const { project, name } = ctx.request.body;
});

module.exports = project.routes();
