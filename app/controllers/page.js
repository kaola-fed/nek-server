import fetch from 'node-fetch';

import * as _ from '../utils/response';
import { ProjectTypes, PageTypes } from '../utils/enums';
import PageModel from '../models/Page';
import ProjectModel from '../models/Project';

import { codegen } from 'nek-server-core';

// 工具函数

const translateData = (params, dataTypes) => {
  const rlt = {
    filters: [],
    cols: [],
    message: ''
  };

  rlt.filters = params.inputs.map((item) => {
    return {
      title: item.description || item.name || '条件',
      key: item.name,
      type: 'kl-input'
    };
  });

  try {
    const resultTypeId = params.outputs.find(item => item.name == 'result' || item.name == 'data').type;
    const resultData = dataTypes.find(item => item.id == resultTypeId);
    const listId = resultData.params.find(item => item.name == 'list').type;
    const listParams = dataTypes.find(item => item.id == listId);
    rlt.cols = listParams.params.map((item) => {
      return {
        name: item.description || item.name || '列名',
        key: item.name,
        typeName: item.typeName || 'String',
        width: '120'
      };
    });
  } catch (err) {
    rlt.message = '响应信息格式错误';
  }

  return rlt;
};

// Controllers

export const nei = async (ctx) => {
  const { id, url } = ctx.query;
  if(!id || !url) {
    return ctx.body = _.paramsError();
  }
  let key;
  try {
    const pageModel = await PageModel.selectByIdWithKey(id);
    key = pageModel.key.key;
  } catch (err) {
    return ctx.body = _.error('获取配置失败，请检查项目配置key、页面url是否正确');
  }
  const neiUrl = 'https://nei.netease.com/api/projectres/';
  const retObj = {
    code: 200,
    message: null,
    data: {}
  };

  try {
    const rlt = await fetch(`${neiUrl}?key=${key}&spectype=0`);
    const { result } = await rlt.json();
    const interfaces = result.interfaces.find(item => item.path == url);
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
      retObj.data = rlt;
    }
  } catch (err) {
    retObj.code = 400;
    retObj.message = '获取NEI接口失败，请检查key';
  }

  ctx.body = retObj;
};

export const createPage = async (ctx) => {
  const postData = ctx.request.body;
  const page = {
    ...postData,
    project: postData.projectId
  };
  if(!postData.projectId) {
    return ctx.body = _.paramsError();
  }
  try {
    await PageModel.create(page);
    return ctx.body = _.success();
  } catch (err) {
    return ctx.body = _.error('创建失败，请检查url是否已存在');
  }
};

export const updatePageDom = async (ctx) => {
  const { id, dom } = ctx.request.body;
  if(!id || !dom ) {
    return ctx.body = _.paramsError();
  }
  try {
    await PageModel.modifyDom(id, dom);
    return ctx.body = _.success();
  } catch (err) {
    return ctx.body = _.error();
  }
};

export const updateSetting = async (ctx) => {
  const postData = ctx.request.body;
  if (!postData) {
    return ctx.body = _.paramsError();
  }
  try {
    await PageModel.modifySetting(postData.id, postData);
    return ctx.body = _.success();
  } catch (err) {
    return ctx.body = _.error('更新失败，请检查url是否已存在');
  }
};

export const deletePage = async (ctx) => {
  const { id, pageId } = ctx.query;
  if(!id || !pageId) {
    return ctx.body = _.paramsError();
  }
  try {
    await PageModel.deleteById(pageId);
    return ctx.body = _.success();
  } catch (err) {
    return ctx.body = _.error('删除失败');
  }
};

export const pageList = async (ctx) => {
  const projectId = ctx.query.id;
  if(!projectId) {
    return ctx.body = _.paramsError();
  }
  try {
    const pages = await PageModel.selectByProject(projectId);
    return ctx.body = _.success(pages);
  } catch (err) {
    return ctx.body = _.error('获取页面列表失败');
  }
};

export const listTemplate = async (ctx) => {
  const pageId = ctx.query.id;
  if(!pageId) {
    return ctx.body = _.paramsError();
  }
  try {
    const { dom } = await PageModel.selectById(pageId);
    const data = !!dom ? JSON.parse(dom) : {};
    return ctx.body = _.success(data);
  } catch (err) {
    return ctx.body = _.error('获取页面信息失败');
  }
};

export const pageDetail = async (ctx) => {
  const pageId = ctx.query.id;
  if(!pageId) {
    return ctx.body = _.paramsError();
  }
  try {
    const pageModel = await PageModel.selectByIdWithKey(pageId);
    return ctx.body = _.success(pageModel);
  } catch (err) {
    return ctx.body = _.error('获取页面信息失败');
  }
};

export const genList = (projectConfig, pageTitle, config) => {
  switch (projectConfig.type) {
    case ProjectTypes.NEJ:
      // 只要有一个分模块的就建立多文件
      if (config.TabsEnable && config.lists.find(el => el.module)) {
        return codegen.NEJ.buildMulList(config, {
          pageTitle,
          jsConfig: {ListPath: projectConfig.listPath}
        });
      }
      return codegen.NEJ.buildList(config, {
        pageTitle,
        jsConfig: {ListPath: projectConfig.listPath}
      });
    case ProjectTypes.Webpack:
      return codegen.Webpack.buildList(config, {
        pageTitle,
        jsConfig: {ListPath: projectConfig.listPath}
      });
    default:
      break;
  }
};

export const gen = async (id) => {
  const { type, dom, project, name } = await PageModel.selectById(id);
  const projectConfig = await ProjectModel.selectByIdWithLib(project);
  const config = JSON.parse(dom || '{}');

  let result;
  switch (type) {
    case PageTypes.List:
      result = genList(projectConfig, name, config);
      break;
    case PageTypes.Empty:
      break;
    default:
      break;
  }

  if (!result) {
    throw new Error('Generator error.');
  }

  return result;
};

export const getTpl = async (id) => {
  const { url, project } = await PageModel.selectByIdWithPro(id);
  const result = { ftl: '', entry: '', url, type: project.type };
  switch (project.type) {
    case ProjectTypes.NEJ:
      result.ftl = project.ftl;
      result.entry = project.entry;
      break;
    case ProjectTypes.Webpack:
    case ProjectTypes.WebpackMul:
      break;
    default:
      break;
  }
  return result;
};
