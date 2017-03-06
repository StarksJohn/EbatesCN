/**
 * Created by Ebates on 17/1/3.
 * sync 里方法的名字必须和所存数据的key完全相同
 */

import *as TokenAPI from '../../NetWork/API/TokenAPI'
import *as TokenDB from '../BizDB/TokenDB'
import *as BizApi from '../../NetWork/API/BizApi'


export default sync = {
    /**
     * 获取非登录状态的token接口&&缓存
     * @returns {Promise}
     */
    unLoginStateToken(){
        return new Promise(
            (resolve, reject) => {
                Log.log('sync unLoginStateToken 未登录token 在 缓存里判断过期,需要重新 调 接口拿 新的未登录token')
                TokenAPI.getClientTokenApi().then((responseData) => {
                    TokenDB.saveUnLoginStateToken(responseData);
                    resolve(TokenDB.unLoginTokenSchema.data);
                }).catch((error) => {
                    reject(error);
                });
            }
        );
    },
    /**
     * 获取登录状态的token接口&&缓存
     * @returns {Promise}
     */
    LoginStateToken(){
        return new Promise(
            (resolve, reject) => {
                Log.log('sync LoginStateToken 登录token 在 缓存里判断过期,需要重新 调 getRefreshToken 接口拿 新的 登录后 token')

                let getRefreshToken=()=>{
                    Log.log('sync LoginStateToken  开始 调 刷新 登录 token 的' +
                        ' 接口,TokenDB.loginTokenSchema.data.refresh_token='+TokenDB.loginTokenSchema.data.refresh_token);
                    BizApi.LogInApi.getRefreshToken().then(
                        (responseData) => {
                            Log.log('sync LoginStateToken 刷新 登录 token 成功,  responseData=' + Log.writeObjToJson(responseData))
                            resolve(responseData);
                        }
                    ).catch((error) => {
                        // reject(error);
                    });
                };

                //检测未登录token是否合法 &&  刷新 登录 token
                let checkUnLoginTokenSchema=()=>{
                    if (!TokenDB.unLoginTokenSchema.isExpires()) {//内存里 未登陆token 未过期
                        getRefreshToken();
                    } else {//未登陆token 已过期,刷新 未登陆 token
                        TokenDB.unLoginTokenSchema.refreshToken().then(
                            () => {
                                getRefreshToken();
                            }
                        ).catch((error) => {
                            reject(error);
                        });
                    }
                }

                if (TokenDB.unLoginTokenSchema.available()) {//因 getRefreshToken()刷新登录token接口 里需要 未登录token,故先判断内存里的未登录token是否可用
                    checkUnLoginTokenSchema();

                } else {//内存里没有 未登录token, 先得 从缓存里读取
                    TokenDB.loadUnLoginStateToken().then((tokenObj) => {
                        Log.log('TokenAPI getTokenWhenAppOpen 读取 unLoginTokenSchema.data 的 缓存成功 =' + Log.writeObjToJson(tokenObj));
                        checkUnLoginTokenSchema();

                    }).catch((e) => {
                        if (e.name == 'NotFoundError') {//未登录状态的token没有
                            gStorage.sync.unLoginStateToken().then((tokenObj) => {
                                getRefreshToken();
                            });
                        }
                    });
                }
            }
        );

    }
}