import * as _ from '../utils/response';
import KeyModel from '../models/Key';

export const list = async (ctx) => {
  const projectId = ctx.query.projectId;
  if (!projectId) {
    return ctx.body = _.paramsError();
  }
  try {
    const list = await KeyModel.selectByProject(projectId);
    return ctx.body = _.success(list);
  } catch (err) {
    return ctx.body = _.error('获取key列表失败');
  }
};

export const add = async (ctx) => {
  const key = ctx.request.body;
  if (!key.projectId) {
    return ctx.body = _.paramsError();
  }
  try {
    key.project = key.projectId;
    delete key.projectId;
    await KeyModel.insert(key);
    return ctx.body = _.success();
  } catch (err) {
    return ctx.body = _.error('新增key失败');
  }
};

export const edit = async (ctx) => {
  const key = ctx.request.body;
  if (!key.id || !key.projectId) {
    return ctx.body = _.paramsError();
  }
  try {
    key.project = key.projectId;
    delete key.projectId;
    await KeyModel.modify(key.id, key);
    return ctx.body = _.success();
  } catch (err) {
    return ctx.body = _.error('key更新失败');
  }
};

export const remove = async (ctx) => {
  const keyId = ctx.query.id;
  if (!keyId) {
    return ctx.body = _.paramsError();
  }
  try {
    await KeyModel.deleteById(keyId);
    return ctx.body = _.success();
  } catch (err) {
    return ctx.body = _.error('key删除失败');
  }
};

export const detail = async (ctx) => {
  const keyId = ctx.query.id;
  if (!keyId) {
    return ctx.body = _.paramsError();
  }
  try {
    const key = await KeyModel.selectById(keyId);
    return ctx.body = _.success(key);
  } catch (err) {
    return ctx.body = _.error('获取key失败');
  }
};
