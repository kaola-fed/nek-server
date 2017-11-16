import fetch from 'node-fetch';

import * as _ from '../utils/response';

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
  return ctx.body = _.success();
};

export const getList = async (ctx) => {
  return ctx.body = _.success();
};

export const update = async (ctx) => {
  return ctx.body = _.success();
};

export const detail = async (ctx) => {
  return ctx.body = _.success();
};
