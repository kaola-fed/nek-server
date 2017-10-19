const path = require('path');
const decache = require('decache');
const { existsSync } = require('fs-extra');
const config = require('../config/client');

const getAsyncMock = (method, ctx, urlPath, options) => {
  const { asyncMockPath, defaultMock = { code: 200 } } = options;
  if (!asyncMockPath) {
    console.warn(`urlPath: ${urlPath}, mockPath: ${asyncMockPath}, not exists`);
    return defaultMock
  }
  const mockFile = path.join(asyncMockPath, method.toLowerCase(), urlPath);
  return readObj(mockFile, ctx, defaultMock)
};

const readObj = (file, ctx, defaultMock = {}) => {
  const jsonName = file + '.json';
  const jsName = file + '.js';

  if (!existsSync(jsonName) && !existsSync(jsName)) {
    console.warn(`${file}.js{on} doesn't exists`);
    return defaultMock
  }
  try {
    decache(file);
    const obj = require(file);
    if (typeof obj === 'function') {
      return obj(ctx)
    }
    return obj
  } catch (err) {
    console.error(err);
    return defaultMock
  }
};

module.exports = (prefixes, options) => {
  return (req, res, next) => {
    const regex = new RegExp(`^(${prefixes.join('|')})`);
    const prefix = req.path.match(regex);
    if (prefix && prefix[0]) {
      const apiPath = req.path.replace(prefix[0], '');
      const data = getAsyncMock(req.method, req, apiPath, options);
      res.send(data)
    } else {
      next()
    }
  }
};
