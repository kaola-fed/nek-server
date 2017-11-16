const config = {
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',

  baseUri: 'https://login.netease.com/connect',
  authorizeUri: 'https://login.netease.com/connect/authorize',
  tokenUri: 'https://login.netease.com/connect/token',
  userInfoUri: 'https://login.netease.com/connect/userinfo',
  redirectUri: 'http://nek-server.kaolafed.com:3000/api/login'
};

export default config;

/* eslint-disable camelcase */
export const openIDConfig = {
  client_id: config.clientId,
  client_secret: config.clientSecret,
  redirect_uri: config.redirectUri
};
/* eslint-enable camelcase */

export const sessionConfig = {
  key: process.env.SESSION_KEY || 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
};

export const dbConfig = {
  url: process.env.MONGODB_URL || ''
}
