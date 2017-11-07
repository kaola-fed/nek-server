export const session = {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
};
export const client_id = '4eca5836c3b011e7aff65cf3fc96a72c';
export const client_secret = '9878cc88c528404d833b128986e871674eca5e62c3b011e7aff65cf3fc96a72c';

export const base_uri = 'https://login.netease.com/connect';
export const authorize_uri = 'https://login.netease.com/connect/authorize';
export const token_uri = 'https://login.netease.com/connect/token';
export const userinfo_uri = 'https://login.netease.com/connect/userinfo';
export const redirect_uri = 'http://10.242.89.35:3000/login';
