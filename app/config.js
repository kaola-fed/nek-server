export const session = {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
};
export const client_id = '4a4d3d9499eb11e7b06f5cf3fc793244';
export const client_secret = '3178ec5b517343a3a44c2399eafcb9fa4a4d43fc99eb11e7b06f5cf3fc793244';

export const base_uri = 'https://login.netease.com/connect';
export const authorize_uri = 'https://login.netease.com/connect/authorize';
export const token_uri = 'https://login.netease.com/connect/token';
export const userinfo_uri = 'https://login.netease.com/connect/userinfo';
export const redirect_uri = 'http://10.243.48.239:3000/login';
