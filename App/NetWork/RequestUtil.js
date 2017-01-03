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
    let header=new Headers();
    header.append('Content-Type','application/x-www-form-urlencoded');//headers里固定要传的,因body传xxx&xxx 格式的字符串
    // headersArray.map( 此方式拿不到 外部的header
    //     (v,i)=>{
    //         header.append(JSON.stringify(v.key),JSON.stringify(v.value));
    //     }
    // );
    headersAppendCallBack(header);

    let request=new Request(url,{
        method:method,headers:header, body:body
    });
    let isOk;

    return new Promise((resolve, reject) => {
        fetch(request)
            .then((response) => {
                if (response.ok) {
                    isOk = true;
                } else {
                    isOk = false;
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
