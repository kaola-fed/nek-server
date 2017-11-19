import fetch from 'node-fetch';

import * as _ from '../utils/response';
import UserModel from '../models/User';
import ProjectModel from '../models/Project';
import PageModel from '../models/Page';

export const create = async (ctx) => {
  const user = ctx.session.user;
  const project = ctx.request.body;
  project.members = [{ _id: user.id }];
  try {
    const projectModel = await ProjectModel.insert(project);
    UserModel.addProject(user.id, projectModel._id);
    return ctx.body = _.success(project);
  } catch (err) {
    return ctx.body = _.error('新建失败');
  }
};

export const getList = async (ctx) => {
  const userId = ctx.session.user.id;
  try {
    const projects = await ProjectModel.selectByUser(userId);
    return ctx.body = _.success(projects);
  } catch (err) {
    return ctx.body = _.error('获取项目列表失败');
  }
};

export const update = async (ctx) => {
  const project = ctx.request.body;
  if(!project.id) {
    return ctx.body = _.paramsError()
  }
  try {
    const result = await ProjectModel.modify(project.id, project);
    return ctx.body = _.success(result);
  } catch (err){
    return ctx.body = _.error('更新失败');
  }
};

export const detail = async (ctx) => {
  try {
    const result = await ProjectModel.selectById(ctx.query.id);
    return ctx.body = _.success(result);
  } catch (err) {
    return ctx.body = _.paramsError();
  }
};

export const deleteProject = async (ctx) => {
  const projectId = ctx.query.id;
  const user = ctx.session.user;
  if(!projectId) {
    return ctx.body = _.paramsError();
  }
  try {
    await UserModel.deleteProject(user.id, projectId);
    await ProjectModel.deleteById(projectId);
    await PageModel.deleteByProject(projectId);
  } catch (err) {
    return ctx.body = _.error('删除失败，请检查参数');
  }
  return ctx.body = _.success();
};
