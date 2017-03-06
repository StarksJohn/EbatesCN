/**
 * 通用请求函数
 * RequestUtil
 */
export const isProductionEnvironment = false;//是否是生产环境
export const Staging_Host = 'https://api-staging-current.ebates.cn/';//测试环境的url的 host
export const Production_Host = 'https://api-staging-current.ebates.cn/';//生产环境的url的 host

/**
 * 如果打了生产包, 把 isProductionEnvironment=true,host就统一变成 Production_Host了
 * @returns {string}
 */
export function getStagingOrProductionHost() {
    return isProductionEnvironment ? Production_Host : Staging_Host;
}

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
    header.append('Content-Type', 'application/x-www-form-urlencoded');//headers里固定要传的参数,因body传 key=value&key=value 格式的字符串
    headersAppendCallBack(header);

    // Log.log('RequestUtil request() encodeBody(body)='+encodeBody(body));
    let request = new Request(url, {
        method: method, headers: header, body: encodeBody(body)
    });
    let isOk;

    return new Promise((resolve, reject) => {
        fetch(request)
            .then(
                //第一个参数 函数 回调,就表示 fetch 成功
                (response) => {//通用的所有接口都会返回的response通用数据 结构,目前 注册接口返回的 response 对象不是 json格式,导致 response.json()
                    // 失败;后期服务器会在 response 里加个 message 字段,来 描述接口返回 的信息,不过返回的body里已经有message字段
                    // if (response.ok) {
                    //     isOk = true;
                    // } else {//
                    //     isOk = false;
                    //     reject({status: response.status})
                    // }

                    isOk=response.ok;

                    return response.json();//拿 body,成功或错误的信息都在 body里,此时返回的body 必须是 json 格式,否则解析出错
                },
                //第2个参数 函数 回调,就表示 fetch 失败,可能是网络没了等原因,表示接口本身就没通
                (e) => {
                    // if (e.message) {
                    //     BizShowToast(e.message);
                    // }
                    Log.log('RequestUtil request() fetch 失败 ,e='+Log.writeObjToJson(e))
                    reject(e);
                })
            .then((responseData/*responseData 是 第一个then里 response.json() 执行成功 后 返回的 body*/) => {
                    if (isOk) {//接口是通的,并且request时的参数没问题,故返回了正确的数据
                        resolve(responseData);
                    } else {//接口是通的,但request时可能参数不对,导致返回的数据是不对的
                        Log.log('RequestUtil request() request时可能参数不对 ,e='+Log.writeObjToJson(responseData))

                        reject(responseData);
                    }
                },
                (e /*e 是 第一个then里 response.json() 执行失败 后 返回的 error*/) => {
                    Log.log('RequestUtil request() 解析 body 出错 ,e='+Log.writeObjToJson(e))

                    reject(e);
                }
            )
            .catch((error) => {
                Log.log('RequestUtil request() 未知错误 ,error='+Log.writeObjToJson(error))

                reject(error);
            });
    });
};

export const GET = (url, params, headersAppendCallBack) => {

    url = encodeURL(url, params);

    return request(url, 'GET', headersAppendCallBack, null);
}

/**
 *
 * @param url
 * @param headersAppendCallBack
 * @param body 传 key=value&key=value  类型,因 header.append('Content-Type', 'application/x-www-form-urlencoded')
 * @returns {Promise}
 * @constructor
 */
export const POST = (url, headersAppendCallBack, body) => {
    return request(url, 'POST', headersAppendCallBack, body);
}

/**
 * 拼接参数
 * @param url
 * @param params
 * @returns {*}
 */
const encodeURL = (url, params) => {
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

/**
 * 因header.append('Content-Type', 'application/x-www-form-urlencoded');//headers里和服务器约定好了加了个body数据类型的参数,故得把 body 对象 转化成 key=value&key=value 格式的字符串,并且 body得 encodeURIComponent 转码,把 body里的 特殊字符转 编码
 * @param body
 * @returns {string}
 */
const encodeBody = (body) => {
    if (body) {
        let paramsArray = [];
        Object.keys(body).forEach(key => paramsArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(body[key])))
        return paramsArray.join('&');

    }

    return '';
}

/**
 * 所有接口通用的 返回错误信息的 提示
 * @param error
 */
export function showErrorMsg(error) {
    BizShowToast(error.error.message);

}