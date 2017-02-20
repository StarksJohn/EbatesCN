/**
 * 通用请求函数
 */
// const HOST = 'http://apis.baidu.com/';

/**
 * 通用请求
 * @param url
 * @param method
 * @param headersAppendCallBack: 外部 加具体 的 header,因 内部
 * @param body
 * @returns {Promise}
 */
export const request = (url, method, headersAppendCallBack, body) => {
    let header = new Headers();
    header.append('Content-Type', 'application/x-www-form-urlencoded');//headers里固定要传的参数,因body传xxx&xxx 格式的字符串
    // headersArray.map( 此方式拿不到 外部的header,只能用 callBack形式外部 添加 header
    //     (v,i)=>{
    //         header.append(JSON.stringify(v.key),JSON.stringify(v.value));
    //     }
    // );
    headersAppendCallBack(header);

    let request = new Request(url, {
        method: method, headers: header, body: body
    });
    let isOk;

    return new Promise((resolve, reject) => {
        fetch(request)
            .then((response) => {
                if (response.ok) {
                    isOk = true;
                } else {
                    isOk = false;
                    reject({status:response.status})
                }
                return response.json();
            })
            .then((responseData) => {
                if (isOk) {
                    resolve(responseData);
                } else {
                    reject(responseData);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const GET = (url, params, headersAppendCallBack) => {

    url=encodeURL(url,params);

   return request(url,'GET',headersAppendCallBack,null);
}

/**
 *
 * @param url
 * @param params
 * @param headersAppendCallBack
 * @param body 传 key=value&key=value  类型
 * @returns {Promise}
 * @constructor
 */
export const POST = (url, params, headersAppendCallBack,body) => {
    return request(url,'POST',headersAppendCallBack,body);
}

/**
 * 拼接参数
 * @param url
 * @param params
 * @returns {*}
 */
const encodeURL=(url,params)=>{
    if (params) {
        let paramsArray = [];
        //encodeURIComponent 拼接参数
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    return url;
}