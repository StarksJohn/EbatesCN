/**
 * Created by Ebates on 16/12/23.
 * TokenAPI
 * 获取 登录| 未登录 token 的网络请求API
 */
import *as RequestUtil from '../RequestUtil'
import *as TokenDB from '../../DB/BizDB/TokenDB'

/**
 * 第一次打开app时,根据是否登陆拿 非登录 或登录 token 的 缓存
 */
export function getTokenWhenAppOpen() {
    if (!gUserDB.isLogin()) {
        TokenDB.loadUnLoginStateToken().then((tokenObj)=>{
            Log.log('token==='+token);
        }).catch((e)=>{
            if (e.name=='NotFoundError'){//未登录状态的token 过期 或没有
                Log.log('TokenAPI getTokenWhenAppOpen NotFoundError')
                storage.sync.unLoginStateToken().then((tokenObj)=>{
                    Log.log('token==='+token);
                });
            }
        });
    }
}

/**
 * 获取 未登录状态的token
 */
export function getClientTokenApi() {
    return new Promise(
        (resolve, reject) => {

            let url=RequestUtil.Staging_Host+'oauth/client_token';
            let body = {
                grant_type: 'client_credentials',
                client_id: TokenDB.unLoginTokenSchema.data.client_id,
                client_secret: TokenDB.unLoginTokenSchema.data.client_secret
            }
            RequestUtil.POST(url,
                (header) => {
                    // header.append('Authorization','Bearer '+'xxx');//xxx是获取到的token,拿到token后的其他所有接口都传此header参数
                }, body/*'grant_type=client_credentials&client_id=1&client_secret=bZRiVM1KmHFFmdpjJDcbh78gyHRwoqAvlIarXOb1'*/
            ).then((responseData) => {
                Log.log('TokenAPI getClientTokenApi resolve ');
                resolve(responseData);
            }).catch((error) => {
                reject(error);
            });
        }
    );
}


