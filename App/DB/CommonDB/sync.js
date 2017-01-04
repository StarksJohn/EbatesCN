/**
 * Created by Ebates on 17/1/3.
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
                TokenAPI.getUnLoginTokenAPI().then((responseData) => {
                    TokenDB.saveUnLoginStateToken(responseData);
                    resolve(responseData);
                });
            }
        );

    }
}