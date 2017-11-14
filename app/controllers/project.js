import fetch from 'node-fetch';

export const nei = async (ctx, next) => {
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
        const interfaces = result.interfaces.filter(item => item.path == path);
        const dataTypes = result.datatypes;
        if(interfaces.length == 0) {
            retObj.code = 400;
            retObj.message = 'nei项目中未查到对应url，请检查';
        } else {
            const params = interfaces[0].params;
            const rlt = translateData(params, dataTypes);
            if(rlt.message) {
                retObj.code = 400;
                retObj.message = rlt.message;
            }
            delete rlt.message;
            retObj.result = rlt;
        }

    } catch (err) {
        retObj.code = 400;
        retObj.message = '获取nei接口失败，请检查key';
    }
    ctx.body = retObj;
}
const translateData = (params, dataTypes) => {
    const rlt = {
        filters: [],
        cols: [],
        message: ''
    };
    params.inputs.forEach(item => {
        rlt.filters.push({
            title: item.description,
            key: item.name,
            typeName: item.typeName || 'String'
        });
    });
    try {
        const resultTypeId = params.outputs.filter(item => item.name == 'result' || item.name == 'data')[0].type;
        const resultData = dataTypes.filter(item => item.id == resultTypeId);
        const listId = resultData[0].params.filter(item => item.name == 'list')[0].type;
        const listParams = dataTypes.filter(item => item.id == listId);
        listParams[0].params.forEach(item => {
            rlt.cols.push({
                title: item.description,
                key: item.name,
                typeName: item.typeName || 'String'
            });
        });
    } catch (err) {
        rlt.message = '响应信息格式错误';
    }
    return rlt;
}
