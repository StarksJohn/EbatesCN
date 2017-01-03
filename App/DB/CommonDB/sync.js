/**
 * Created by Ebates on 17/1/3.
 */

import *as TokenAPI from '../../NetWork/API/TokenAPI'
import *as TokenDB from '../BizDB/TokenDB'

export default sync={
    unLoginStateToken(){
        // let { resolve, reject } = params;

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