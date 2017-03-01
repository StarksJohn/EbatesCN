/**
 * Created by Ebates on 16/12/23.
 * TokenAPI
 * 获取 登录| 未登录 token 的网络请求API
 */
import *as RequestUtil from '../RequestUtil'
import *as TokenDB from '../../DB/BizDB/TokenDB'

/**
 * 第一次打开app时,根据是否登陆拿 非登录 或 登录 token 的 缓存,分别给 TokenDB.loginTokenSchema和 TokenDB.unLoginTokenSchema 对象赋值
 */
export function getTokenWhenAppOpen() {
    if (!gUserDB.isLogin()) {
        {
            TokenDB.loadUnLoginStateToken().then((tokenObj)=>{
                Log.log('TokenAPI getTokenWhenAppOpen 读取 unLoginTokenSchema.data 缓存成功,未过期 ='+Log.writeObjToJson(tokenObj));
            }).catch((e)=>{
                if (e.name=='NotFoundError'){//未登录状态的token没有
                    Log.log('TokenAPI getTokenWhenAppOpen NotFoundError')
                    storage.sync.unLoginStateToken().then((tokenObj)=>{
                        // Log.log('token==='+token);
                    });
                }
            });
        }

    }
}

/**
 * 检查 内存里的 非登录 token 是否过期,在调 所有 外部接口前 检测
 */
export function checkUnLoginTokenExpires() {
    return new Promise(
        (resolve, reject)=>{
            if (TokenDB.unLoginTokenSchema.isExpires()){//判断 非登录token 过期
                Log.log('TokenAPI checkUnLoginTokenExpires 未登录token 在 内存里判断 已过期,开始 重新获取 未登录token');

                storage.sync.unLoginStateToken().then((tokenObj)=>{
                    resolve();
                });
            }else{
                Log.log('TokenAPI checkUnLoginTokenExpires 未登录token 未过期')
                resolve();
            }
        }
    );

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
                client_id: TokenDB.UnLoginTokenclient_id,
                client_secret: TokenDB.UnLoginTokenclient_secret
            }
            RequestUtil.POST(url,
                (header) => {
                    // header.append('Authorization','Bearer '+'xxx');//xxx是获取到的token,拿到token后的其他所有接口都传此header参数
                }, body
            ).then((responseData) => {
                // Log.log('TokenAPI getClientTokenApi resolve ');
                resolve(responseData);
            }).catch((error) => {
                reject(error);
            });
        }
    );
}


