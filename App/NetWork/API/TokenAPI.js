/**
 * Created by Ebates on 16/12/23.
 * TokenAPI
 * 获取 登录| 未登录 token 的网络请求API
 */
import *as RequestUtil from '../RequestUtil'
import *as TokenDB from '../../DB/BizDB/TokenDB'

/**
 * 第一次打开app时,根据是否登陆拿 非登录 或 登录 token 的 缓存,分别给 内存里的 TokenDB.loginTokenSchema和 TokenDB.unLoginTokenSchema 对象赋值
 */
export function getTokenWhenAppOpen() {
    gUserDB.isLogin().then(
        (b) => {//上次关闭app时处于登录状态
            TokenDB.loadLoginStateToken().then((tokenObj) => {
                Log.log('TokenAPI getTokenWhenAppOpen 读取 LoginTokenSchema.data 的缓存成功 =' + Log.writeObjToJson(tokenObj));
            })
        },
        (e) => {//上次关闭app时处于非登录状态
            TokenDB.loadUnLoginStateToken().then((tokenObj) => {
                Log.log('TokenAPI getTokenWhenAppOpen 读取 unLoginTokenSchema.data 的 缓存成功 =' + Log.writeObjToJson(tokenObj));
            }).catch((e) => {
                if (e.name == 'NotFoundError') {//未登录状态的token没有
                    Log.log('TokenAPI getTokenWhenAppOpen NotFoundError')
                    storage.sync.unLoginStateToken().then((tokenObj) => {
                        // Log.log('token==='+token);
                    });
                }
            });
        }
    ).catch((error) => {
        Log.log('TokenAPI getTokenWhenAppOpen error= '+error);
    });
}

/**
 * 检查 内存里的 可用的 (如果登录token可用,优先用登录token) token 是否过期;若 非登录token过期就重新调 getClientTokenApi ()接口拿新的未登录token并缓存;若 登录后token过期就调xxx接口刷新登录token; 然后 在调 所有 外部或内部 接口
 */
export function checkAvailableMemoryTokenExpiresWhenUseApi() {
    return new Promise(
        (resolve, reject) => {
            let tokenSchema = TokenDB.getAvailableToken();
            if (tokenSchema.isExpires()) {//判断 可用的token是否 过期
                Log.log('TokenAPI checkAvailableMemoryTokenExpiresWhenUseApi 未登录token 在 内存里判断 已过期,开始 重新获取 未登录token');
                return tokenSchema.refreshToken().then(
                    () => {
                        resolve();
                    }
                );
            } else {
                Log.log('TokenAPI checkAvailableMemoryTokenExpiresWhenUseApi 当前可用的 ' + tokenSchema.name + ' 未过期,可开始调 接口 ')
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

            let url = RequestUtil.getStagingOrProductionHost() + 'oauth/client_token';
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
                BizShowToast(error.error.message);
                reject(error);
            });
        }
    );
}


