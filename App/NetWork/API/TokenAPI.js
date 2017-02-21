/**
 * Created by Ebates on 16/12/23.
 *
 * 获取 登录| 未登录 token 的网络请求API
 */
import *as RequestUtil from '../RequestUtil'

/**
 * 获取 未登录状态的token
 */
export function getUnLoginTokenAPI() {
    return new Promise(
        (resolve, reject) => {
            // RequestUtil.request('https://api-staging-test.ebates.cn/oauth/token', 'POST',
            //     (header) => {
            //         // header.append('Authorization','Bearer '+'xxx');//xxx是获取到的token,拿到token后的其他所有接口都传此header参数
            //     },
            //     'grant_type=client_credentials&client_id=1&client_secret=bZRiVM1KmHFFmdpjJDcbh78gyHRwoqAvlIarXOb1'
            // ).then((responseData) => {
            //     resolve(responseData);
            // }).catch((error) => {
            //     reject(error);
            // });


            let body = {
                grant_type: 'client_credentials',
                client_id: '1',
                client_secret: 'bZRiVM1KmHFFmdpjJDcbh78gyHRwoqAvlIarXOb1'
            }
            RequestUtil.POST('https://api-staging-test.ebates.cn/oauth/token',
                (header) => {
                    // header.append('Authorization','Bearer '+'xxx');//xxx是获取到的token,拿到token后的其他所有接口都传此header参数
                }, body
                //'grant_type=client_credentials&client_id=1&client_secret=bZRiVM1KmHFFmdpjJDcbh78gyHRwoqAvlIarXOb1'
            ).then((responseData) => {
                resolve(responseData);
            }).catch((error) => {
                reject(error);
            });
        }
    );

    // RequestUtil.request('https://api-staging-test.ebates.cn/oauth/token', 'POST',
    //     (header)=> {
    //         // header.append('Authorization','Bearer '+'xxx');//xxx是获取到的token,拿到token后的其他所有接口都传此header参数
    //     },
    //     'grant_type=client_credentials&client_id=1&client_secret=bZRiVM1KmHFFmdpjJDcbh78gyHRwoqAvlIarXOb1'
    // )
    //     .then((responseData) => {
    //         // showToast('responseData===' + responseData);
    //         // TokenDB.saveUnLoginStateToken(responseData);
    //         return responseData;
    //     })
    //     .catch((error) => {
    //         showToast(error.message);
    //     });
}


