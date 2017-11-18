import * as _ from '../utils/response';
import LibraryModel from '../models/Library';
import ComponentModel from '../models/Component';

export const list = async (ctx) => {
  const list = await LibraryModel.selectAll();
  return ctx.body = _.success(list);
};

export const add = async (ctx) => {
  const library = ctx.request.body;
  try {
    await LibraryModel.insert(library);
  } catch (err) {
    return ctx.body = _.error('新增组件库失败');
  }
  return ctx.body = _.success();
};

export const edit = async (ctx) => {
  const library = ctx.request.body;
  if(!library.id) {
    return ctx.body = _.paramsError();
  }
  try {
    await LibraryModel.modify(library.id, library);
  } catch (err) {
    return ctx.body = _.error('组件库更新失败');
  }
  return ctx.body = _.success();
};

export const remove = async (ctx) => {
  const libraryId = ctx.query.id;
  if(!libraryId) {
    return ctx.body = _.paramsError();
  }
  try {
    await LibraryModel.deleteById(libraryId);
  } catch (err) {
    return ctx.body = _.error('组件库删除失败');
  }
  return ctx.body = _.success();
};

export const detail = async (ctx) => {
  const libraryId = ctx.query.id;
  if(!libraryId) {
    return ctx.body = _.paramsError();
  }
  try {
    const library = await LibraryModel.selectById(libraryId);
    return ctx.body = _.success(library);
  } catch (err) {
    return ctx.body = _.error('获取组件库详情失败');
  }
};

export const getComponents = async (ctx) => {
  const libraryId = ctx.query.id;
  if(!libraryId) {
    return ctx.body = _.paramsError();
  }
  try {
    const library = await LibraryModel.selectById(libraryId);
    const components = await ComponentModel.selectByLib(libraryId);
    return ctx.body = _.success({ ...library._doc, components });
  } catch (err) {
    console.log(err);
    return ctx.body = _.error('获取组件列表失败');
  }
};

export const addComponent = async (ctx) => {
  const component = ctx.request.body;
  if(!component.library) {
    return ctx.body = _.paramsError();
  }
  try {
    await ComponentModel.insert(component);
    return ctx.body =_.success();
  } catch (err) {
    return ctx.body = _.error('添加组件失败，请检查参数');
  }
};

export const editComponent = async (ctx) => {
  const component = ctx.request.body;
  if(!component.id || !component.library) {
    return ctx.body = _.paramsError();
  }
  try {
    await ComponentModel.modify(component.id, component);
    return ctx.body =_.success();
  } catch (err) {
    return ctx.body = _.error('组件更新失败');
  }
};

export const deleteComponent = async (ctx) => {
  const id = ctx.query.id;
  if(!id) {
    return ctx.body = _.paramsError();
  }
  try {
    await ComponentModel.deleteById(id);
    return ctx.body = _.success();
  } catch (err) {
    return ctx.body = _.error('组件删除失败');
  }
};

export const detailComponent = async (ctx) => {
  const id = ctx.query.id;
  if(!id) {
    return ctx.body = _.paramsError();
  }
  try {
    const component = await ComponentModel.selectById(id);
    return ctx.body = _.success(component);
  } catch (err) {
    console.log(err);
    return ctx.body = _.error('获取组件失败');
  }
}
