/**
 * Created by Ebates on 16/12/23.
 *
 * 获取 登录| 未登录 token
 */
import *as RequestUtil from '../RequestUtil'
/**
 * 获取 未登录状态的token
 */
export function getUnLoginToken() {
    RequestUtil.request('https://api-staging-test.ebates.cn/oauth/token', 'POST',
        (header)=>{
            // header.append('Authorization','Bearer '+'xxx');//xxx是获取到的token,拿到token后的其他所有接口都传此heaer参数
        },
        'grant_type=client_credentials&client_id=1&client_secret=bZRiVM1KmHFFmdpjJDcbh78gyHRwoqAvlIarXOb1'
    )
        .then((responseData) => {
            showToast('responseData===' + responseData);
        })
        .catch((error) => {
            showToast(error.message);
        });
}


