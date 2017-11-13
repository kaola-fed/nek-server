import fetch from 'node-fetch';

export const nei = async (ctx, next) => {
    const path = '/InviteUserGoods/list'; //人拉人-获取商品列表
    const neiUrl = 'https://nei.netease.com/api/projectres/';
    const key = '75ff1d26ffebf410d00922de46d2a3d8'; //market-ms的key
    const retObj = {
        code: 200,
        message: null,
        result: {}
    };
    try {
        const rlt = await fetch(`${neiUrl}?key=${key}&spectype=0`);
        const { result } = await rlt.json();
        retObj.result = result.interfaces.filter(item => item.path == path);
    } catch (err) {
        console.log(err);
        retObj.code = 400;
        retObj.message = '获取nei接口失败，请检查key';
    }
    ctx.body = retObj;
}
