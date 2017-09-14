export const session = {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
};
export const client_id = '2f13bca098f711e7b4f65cf3fc96a72c';
export const client_secret = 'd611a8d6fc184cb99350c3def97bb6382f13c32698f711e7b4f65cf3fc96a72c';

export const baseUrl = 'https://login.netease.com/connect';
export const authorizeUrl = 'https://login.netease.com/connect/authorize';
export const tokenUrl = 'https://login.netease.com/connect/token';
export const userinfoUrl = 'https://login.netease.com/connect/userinfo';
export const redirectUrl = 'http://10.243.48.239:3000/login';
