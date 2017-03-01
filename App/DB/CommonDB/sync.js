/**
 * Created by Ebates on 17/1/3.
 * sync里方法的名字必须和所存数据的key完全相同
 */

import *as TokenAPI from '../../NetWork/API/TokenAPI'
import *as TokenDB from '../BizDB/TokenDB'

export default sync={
    /**
     * 获取非登录状态的token接口&&缓存
     * @returns {Promise}
     */
    unLoginStateToken(){
        return new Promise(
            (resolve, reject)=>{
                Log.log('sync unLoginStateToken 未登录token 在 缓存里判断过期,需要重新 调 接口拿 新的未登录token')
                TokenAPI.getClientTokenApi().then((responseData) => {
                    TokenDB.saveUnLoginStateToken(responseData);
                    resolve(TokenDB.unLoginTokenSchema.data);
                });
            }
        );

    }
}