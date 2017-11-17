import fetch from 'node-fetch';

import * as _ from '../utils/response';
import UserModel from '../models/User';
import ProjectModel from '../models/Project';

// 工具函数

const translateData = (params, dataTypes) => {
  const rlt = {
    filters: [],
    cols: [],
    message: ''
  };

  rlt.filters = params.inputs.map((item) => {
    return {
      title: item.description,
      key: item.name,
      typeName: item.typeName || 'String'
    };
  });

  try {
    const resultTypeId = params.outputs.find(item => item.name == 'result' || item.name == 'data').type;
    const resultData = dataTypes.find(item => item.id == resultTypeId);
    const listId = resultData.params.find(item => item.name == 'list').type;
    const listParams = dataTypes.find(item => item.id == listId);
    rlt.cols = listParams.params.map((item) => {
      return {
        title: item.description,
        key: item.name,
        typeName: item.typeName || 'String'
      };
    });
  } catch (err) {
    rlt.message = '响应信息格式错误';
  }

  return rlt;
};

// Controllers

export const nei = async (ctx) => {
  const path = '/api/nei/test'; //人拉人-获取商品列表
  const neiUrl = 'https://nei.netease.com/api/projectres/';
  const key = 'fc2eb89b0fe86b8da375e0bc134e739e'; //market-ms的key
  const retObj = {
    code: 200,
    message: null,
    result: {}
  };

  try {
    const rlt = await fetch(`${neiUrl}?key=${key}&spectype=0`);
    const { result } = await rlt.json();
    const interfaces = result.interfaces.find(item => item.path == path);
    const dataTypes = result.datatypes;
    if (!interfaces) {
      retObj.code = 400;
      retObj.message = 'NEI项目中未查到对应URL，请检查';
    } else {
      const params = interfaces.params;
      const rlt = translateData(params, dataTypes);
      if (rlt.message) {
        retObj.code = 400;
        retObj.message = rlt.message;
      }
      delete rlt.message;
      retObj.result = rlt;
    }
  } catch (err) {
    retObj.code = 400;
    retObj.message = '获取NEI接口失败，请检查key';
  }

  ctx.body = retObj;
};

export const create = async (ctx) => {
  const user = ctx.session.user;
  const project = ctx.request.body;
  project.members = [{ _id: user.id }];
  const projectModel = await ProjectModel.insert(project);
  UserModel.addProject(user.id, {
    _id: projectModel._id,
    name: projectModel.name
  });
  return ctx.body = _.success(project);
};

export const getList = async (ctx) => {
  return ctx.body = _.success();
};

export const update = async (ctx) => {
  const user = ctx.session.user;
  const project = ctx.request.body;
  const result = await ProjectModel.update({
    _id: project.id,
  }, project);
  return ctx.body = _.success(result);
};

export const detail = async (ctx) => {
  try {
    const result = await ProjectModel.findById(ctx.query.id);
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
  } catch (err) {
    return ctx.body = _.error('删除失败，请检查参数');
  }
  return ctx.body = _.success();
}
