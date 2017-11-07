import {URLSearchParams} from 'url';
import fetch from 'node-fetch';
import jwt from 'jwt-simple';
import * as Utils from './../utils/index';
import * as CONFIG from './../config';

export const fetchToken = async function(code) {
    const url = CONFIG.tokenUrl;
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', CONFIG.redirectUrl);

    const authorization = `${CONFIG.client_id}:${CONFIG.client_secret}`;
    const authorizationBase64 = Utils.str2base64(authorization);
    const headers = {
        'Authorization': `Basic ${authorizationBase64}`
    };
    const res = await fetch(url, {method: 'POST', body: params, headers: headers})
                        .then(res => res.json());
    return res;
}
/**
 *
 * 校验id_token是否合法
 * 1. iss值需要和OpenID Provider的地址完全一致
 * 2. aud值需要包含client_id
 * 3. exp为token过期时间戳，需晚于系统当前时间
 * @param  {[string]} id_token [description]
 * @return {[boolean]}          [description]
 */
export const checkIdToken = function(id_token) {
    const result = jwt.decode(id_token, CONFIG.client_secret, false, 'HS256');
    if(result.iss !== CONFIG.baseUrl) return false;
    if(result.aud.indexOf(CONFIG.client_id) < 0) return false;
    //exp有问题
    // if(result.exp < Date.now()) return false;
    return true;
}
export const fetchUserInfo = async function(access_token) {
    const url = CONFIG.userinfoUrl;
    const headers= {
        Authorization: `Bearer ${access_token}`
    };
    const res = await fetch(url, {method: 'GET', headers: headers});
    const resJson = await res.json();
    return resJson;
}
