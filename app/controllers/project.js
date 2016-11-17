const express = require('express');
const Router = require('koa-router');

const project = new Router();

project.get('/', async ctx => {
  ctx.body = 'project';
});

module.exports = project.routes();
